import json
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import math
from dotenv import load_dotenv
import os

try:
    from langchain_neo4j import Neo4jGraph
except ImportError:
    from langchain_community.graphs import Neo4jGraph

@dataclass
class Recommendation:
    """Realistic recommendation result structure based on graph evidence"""
    product_name: str
    brand: str
    category: str
    confidence_score: float  # 0.0 to 1.0 based on graph evidence
    reasoning: List[str]     # Human-readable explanations
    recommendation_type: str
    graph_evidence: Dict[str, Any]  # Actual numbers from graph
    price: Optional[float] = None
    profit_margin: Optional[float] = None
    supplier: Optional[str] = None
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return asdict(self)

class QwipoRecommendationEngine:
    """Graph-based recommendation engine for B2B marketplace"""
    
    def __init__(self, neo4j_uri: str = None, neo4j_username: str = None, neo4j_password: str = None):
        """Initialize the recommendation engine with Neo4j connection"""
        
        # Load environment variables if credentials not provided
        if not neo4j_uri:
            load_dotenv(override=True)
            neo4j_uri = os.getenv("NEO4J_URI")
            neo4j_username = os.getenv("NEO4J_USERNAME", "neo4j")
            neo4j_password = os.getenv("NEO4J_PASSWORD")
        
        self.neo4j_graph = Neo4jGraph(
            url=neo4j_uri,
            username=neo4j_username,
            password=neo4j_password
        )
        print("🎯 Qwipo Recommendation Engine initialized")
    
    def get_retailer_profile(self, retailer_id: str) -> Dict[str, Any]:
        """Get retailer profile and purchase history"""
        cypher = """
        MATCH (r:Retailer {id: $retailer_id})
        OPTIONAL MATCH (r)-[p:PURCHASES]->(prod:Product)
        OPTIONAL MATCH (prod)-[:BELONGS_TO]->(brand:Brand)
        OPTIONAL MATCH (prod)-[:BELONGS_TO]->(cat:Category)
        
        WITH r, 
             COUNT(DISTINCT prod) as products_bought,
             COUNT(DISTINCT brand) as brands_used,
             COUNT(DISTINCT cat) as categories_explored,
             COLLECT(DISTINCT cat.name) as preferred_categories,
             COLLECT(DISTINCT brand.name) as preferred_brands
        
        RETURN r.name as retailer_name,
               r.location as location,
               r.business_type as business_type,
               r.size as size,
               r.customer_segment as segment,
               products_bought,
               brands_used,
               categories_explored,
               preferred_categories,
               preferred_brands
        """
        
        result = self.neo4j_graph.query(cypher, {"retailer_id": retailer_id})
        return result[0] if result else {}
    
    def get_collaborative_recommendations(self, retailer_id: str, limit: int = 10) -> List[Recommendation]:
        """Find products purchased by similar retailers based on graph traversal"""
        
        cypher = """
        // Find the target retailer and their purchases
        MATCH (target:Retailer {id: $retailer_id})
        MATCH (target)-[:PURCHASES]->(purchased:Product)
        
        // Find similar retailers who bought the same products
        MATCH (similar:Retailer)-[:PURCHASES]->(purchased)
        WHERE similar <> target
        
        // Calculate retailer similarity based on common purchases
        WITH target, similar, COUNT(DISTINCT purchased) as common_purchases
        WHERE common_purchases >= 2  // At least 2 products in common
        
        // Find products that similar retailers bought but target hasn't
        MATCH (similar)-[:PURCHASES]->(recommended:Product)
        WHERE NOT (target)-[:PURCHASES]->(recommended)
        
        // Get product details
        OPTIONAL MATCH (recommended)-[:BELONGS_TO]->(brand:Brand)
        OPTIONAL MATCH (recommended)-[:BELONGS_TO]->(category:Category)
        OPTIONAL MATCH (supplier:Supplier)-[:SUPPLIES]->(recommended)
        
        // Calculate recommendation metrics
        WITH recommended, brand, category, supplier,
             COUNT(DISTINCT similar) as similar_retailer_count,
             AVG(common_purchases) as avg_similarity,
             COUNT(DISTINCT similar) as anchor_products,
             AVG(CASE WHEN recommended.price IS NOT NULL THEN toFloat(recommended.price) END) as avg_price,
             AVG(CASE WHEN recommended.margin IS NOT NULL THEN toFloat(recommended.margin) END) as avg_margin
        
        // Calculate confidence score based on multiple factors
        WITH recommended, brand, category, supplier, avg_price, avg_margin,
             similar_retailer_count,
             avg_similarity,
             anchor_products,
             // Confidence: more similar retailers + higher average similarity = higher confidence
             CASE 
                 WHEN similar_retailer_count >= 5 THEN 0.8 + (avg_similarity / 10.0)
                 WHEN similar_retailer_count >= 3 THEN 0.6 + (avg_similarity / 15.0)
                 WHEN similar_retailer_count >= 2 THEN 0.4 + (avg_similarity / 20.0)
                 ELSE 0.2 + (avg_similarity / 25.0)
             END as confidence_score
        
        WHERE confidence_score > 0.3  // Filter low-confidence recommendations
        
        ORDER BY confidence_score DESC, similar_retailer_count DESC
        LIMIT $limit
        
        RETURN recommended.name as product_name,
               COALESCE(brand.name, recommended.brand, 'Unknown') as brand,
               COALESCE(category.name, recommended.category, 'Unknown') as category,
               COALESCE(supplier.name, recommended.supplier, 'Unknown') as supplier,
               confidence_score,
               similar_retailer_count,
               avg_similarity,
               anchor_products,
               avg_price,
               avg_margin
        """
        
        results = self.neo4j_graph.query(cypher, {"retailer_id": retailer_id, "limit": limit})
        
        recommendations = []
        for result in results:
            if result.get('product_name'):  # Ensure valid data
                # Build evidence-based reasoning
                reasoning = [
                    f"{result.get('similar_retailer_count', 0)} similar retailers have purchased this product",
                    f"Average similarity score: {result.get('avg_similarity', 0):.1f} common products"
                ]
                
                if result.get('avg_margin') and result.get('avg_margin') > 20:
                    reasoning.append(f"Higher profit margin: {result.get('avg_margin', 0):.1f}%")
                
                # Create recommendation with graph evidence
                rec = Recommendation(
                    product_name=result['product_name'],
                    brand=result.get('brand', 'Unknown'),
                    category=result.get('category', 'Unknown'),
                    supplier=result.get('supplier'),
                    confidence_score=min(result.get('confidence_score', 0), 1.0),
                    reasoning=reasoning,
                    recommendation_type="Collaborative Filtering",
                    price=result.get('avg_price'),
                    profit_margin=result.get('avg_margin'),
                    graph_evidence={
                        "similar_retailers_count": result.get('similar_retailer_count', 0),
                        "avg_similarity_score": result.get('avg_similarity', 0),
                        "anchor_products": result.get('anchor_products', 0),
                        "confidence_calculation": "Based on retailer similarity and purchase overlap"
                    }
                )
                recommendations.append(rec)
        
        return recommendations
    
    def get_category_expansion_recommendations(self, retailer_id: str, limit: int = 10) -> List[Recommendation]:
        """Recommend products from categories the retailer hasn't explored"""
        
        cypher = """
        // Get retailer's current categories
        MATCH (target:Retailer {id: $retailer_id})-[:PURCHASES]->(purchased:Product)
        OPTIONAL MATCH (purchased)-[:BELONGS_TO]->(purchased_cat:Category)
        
        WITH target, COLLECT(DISTINCT COALESCE(purchased_cat.name, purchased.category)) as current_categories
        
        // Find popular products in unexplored categories
        MATCH (other:Retailer)-[:PURCHASES]->(popular:Product)
        WHERE other <> target
        OPTIONAL MATCH (popular)-[:BELONGS_TO]->(new_cat:Category)
        
        WITH target, current_categories, popular, new_cat,
             COALESCE(new_cat.name, popular.category) as category_name,
             COUNT(DISTINCT other) as popularity_score
        
        WHERE NOT category_name IN current_categories
        AND popularity_score >= 3  // Must be purchased by at least 3 retailers
        
        // Get additional product details
        OPTIONAL MATCH (popular)-[:BELONGS_TO]->(brand:Brand)
        OPTIONAL MATCH (supplier:Supplier)-[:SUPPLIES]->(popular)
        
        // Calculate confidence based on category popularity and retailer business context
        MATCH (target)
        WITH popular, brand, new_cat, supplier, category_name, popularity_score,
             target.business_type as business_type,
             target.size as retailer_size,
             AVG(CASE WHEN popular.price IS NOT NULL THEN toFloat(popular.price) END) as avg_price,
             AVG(CASE WHEN popular.margin IS NOT NULL THEN toFloat(popular.margin) END) as avg_margin
        
        // Calculate confidence: higher for more popular categories
        WITH popular, brand, new_cat, supplier, category_name, popularity_score, 
             business_type, retailer_size, avg_price, avg_margin,
             CASE 
                 WHEN popularity_score >= 10 THEN 0.7
                 WHEN popularity_score >= 7 THEN 0.6
                 WHEN popularity_score >= 5 THEN 0.5
                 ELSE 0.4
             END as confidence_score
        
        ORDER BY confidence_score DESC, popularity_score DESC
        LIMIT $limit
        
        RETURN popular.name as product_name,
               COALESCE(brand.name, popular.brand, 'Unknown') as brand,
               category_name as category,
               COALESCE(supplier.name, popular.supplier, 'Unknown') as supplier,
               confidence_score,
               popularity_score,
               business_type,
               retailer_size,
               avg_price,
               avg_margin
        """
        
        results = self.neo4j_graph.query(cypher, {"retailer_id": retailer_id, "limit": limit})
        
        recommendations = []
        for result in results:
            if result.get('product_name'):
                reasoning = [
                    f"New category opportunity: {result.get('category', 'Unknown')}",
                    f"Popular with {result.get('popularity_score', 0)} other retailers",
                    f"Suitable for {result.get('business_type', 'your business')} businesses"
                ]
                
                if result.get('avg_margin') and result.get('avg_margin') > 25:
                    reasoning.append(f"Attractive margin potential: {result.get('avg_margin', 0):.1f}%")
                
                rec = Recommendation(
                    product_name=result['product_name'],
                    brand=result.get('brand', 'Unknown'),
                    category=result.get('category', 'Unknown'),
                    supplier=result.get('supplier'),
                    confidence_score=result.get('confidence_score', 0),
                    reasoning=reasoning,
                    recommendation_type="Category Expansion",
                    price=result.get('avg_price'),
                    profit_margin=result.get('avg_margin'),
                    graph_evidence={
                        "category_popularity": result.get('popularity_score', 0),
                        "business_type_match": result.get('business_type'),
                        "retailer_size": result.get('retailer_size'),
                        "confidence_calculation": "Based on category adoption by similar businesses"
                    }
                )
                recommendations.append(rec)
        
        return recommendations
    
    def get_brand_loyalty_recommendations(self, retailer_id: str, limit: int = 10) -> List[Recommendation]:
        """Recommend products from brands the retailer already uses"""
        
        cypher = """
        // Find retailer's preferred brands
        MATCH (target:Retailer {id: $retailer_id})-[:PURCHASES]->(purchased:Product)
        OPTIONAL MATCH (purchased)-[:BELONGS_TO]->(preferred_brand:Brand)
        
        WITH target, 
             COLLECT(DISTINCT COALESCE(preferred_brand.name, purchased.brand)) as preferred_brands,
             COUNT(DISTINCT purchased) as total_products_bought
        
        // Find other products from preferred brands that retailer hasn't bought
        UNWIND preferred_brands as brand_name
        
        MATCH (brand_product:Product)
        WHERE (brand_product.brand = brand_name OR EXISTS((brand_product)-[:BELONGS_TO]->(:Brand {name: brand_name})))
        AND NOT (target)-[:PURCHASES]->(brand_product)
        
        // Get popularity of these products
        MATCH (other:Retailer)-[:PURCHASES]->(brand_product)
        WHERE other <> target
        
        // Get product details
        OPTIONAL MATCH (brand_product)-[:BELONGS_TO]->(brand:Brand)
        OPTIONAL MATCH (brand_product)-[:BELONGS_TO]->(category:Category)
        OPTIONAL MATCH (supplier:Supplier)-[:SUPPLIES]->(brand_product)
        
        WITH target, brand_name, brand_product, brand, category, supplier,
             COUNT(DISTINCT other) as product_popularity,
             AVG(CASE WHEN brand_product.price IS NOT NULL THEN toFloat(brand_product.price) END) as avg_price,
             AVG(CASE WHEN brand_product.margin IS NOT NULL THEN toFloat(brand_product.margin) END) as avg_margin
        
        WHERE product_popularity >= 2  // At least 2 other retailers bought it
        
        // Calculate confidence: higher for more popular products from preferred brands
        WITH brand_product, brand, category, supplier, brand_name, product_popularity, avg_price, avg_margin,
             CASE 
                 WHEN product_popularity >= 8 THEN 0.8
                 WHEN product_popularity >= 5 THEN 0.7
                 WHEN product_popularity >= 3 THEN 0.6
                 ELSE 0.5
             END as confidence_score
        
        ORDER BY confidence_score DESC, product_popularity DESC
        LIMIT $limit
        
        RETURN brand_product.name as product_name,
               brand_name as brand,
               COALESCE(category.name, brand_product.category, 'Unknown') as category,
               COALESCE(supplier.name, brand_product.supplier, 'Unknown') as supplier,
               confidence_score,
               product_popularity,
               avg_price,
               avg_margin
        """
        
        results = self.neo4j_graph.query(cypher, {"retailer_id": retailer_id, "limit": limit})
        
        recommendations = []
        for result in results:
            if result.get('product_name'):
                reasoning = [
                    f"From your preferred brand: {result.get('brand', 'Unknown')}",
                    f"Popular with {result.get('product_popularity', 0)} other retailers",
                    "Leverages existing supplier relationships"
                ]
                
                if result.get('avg_margin') and result.get('avg_margin') > 20:
                    reasoning.append(f"Good profit margin: {result.get('avg_margin', 0):.1f}%")
                
                rec = Recommendation(
                    product_name=result['product_name'],
                    brand=result.get('brand', 'Unknown'),
                    category=result.get('category', 'Unknown'),
                    supplier=result.get('supplier'),
                    confidence_score=result.get('confidence_score', 0),
                    reasoning=reasoning,
                    recommendation_type="Brand Loyalty",
                    price=result.get('avg_price'),
                    profit_margin=result.get('avg_margin'),
                    graph_evidence={
                        "product_popularity": result.get('product_popularity', 0),
                        "brand_loyalty": "High",
                        "supplier_synergy": "Existing relationship",
                        "confidence_calculation": "Based on brand preference and product popularity"
                    }
                )
                recommendations.append(rec)
        
        return recommendations
    
    def get_comprehensive_recommendations(self, retailer_id: str, limit_per_type: int = 5) -> Dict[str, List[Recommendation]]:
        """Get recommendations from all algorithms"""
        
        print(f"🔍 Generating comprehensive recommendations for retailer: {retailer_id}")
        
        # Get retailer profile
        profile = self.get_retailer_profile(retailer_id)
        print(f"🏢 Retailer Profile: {profile.get('retailer_name', 'Unknown')} ({profile.get('business_type', 'Unknown')})")
        print(f"   Location: {profile.get('location', 'Unknown')}, Size: {profile.get('size', 'Unknown')}")
        print(f"   Current Portfolio: {profile.get('products_bought', 0)} products, {profile.get('brands_used', 0)} brands")
        
        recommendations = {}
        
        # Collaborative Filtering
        print("\n🤝 Generating collaborative recommendations...")
        collab_recs = self.get_collaborative_recommendations(retailer_id, limit_per_type)
        recommendations['collaborative'] = collab_recs
        print(f"   Found {len(collab_recs)} collaborative recommendations")
        
        # Category Expansion
        print("\n📈 Generating category expansion recommendations...")
        category_recs = self.get_category_expansion_recommendations(retailer_id, limit_per_type)
        recommendations['category_expansion'] = category_recs
        print(f"   Found {len(category_recs)} category expansion opportunities")
        
        # Brand Loyalty
        print("\n🏷️ Generating brand loyalty recommendations...")
        brand_recs = self.get_brand_loyalty_recommendations(retailer_id, limit_per_type)
        recommendations['brand_loyalty'] = brand_recs
        print(f"   Found {len(brand_recs)} brand extension opportunities")
        
        return recommendations
    
    def export_recommendations(self, recommendations: Dict[str, List[Recommendation]], retailer_id: str, output_file: str = None):
        """Export recommendations to JSON file"""
        
        # Convert recommendations to serializable format
        export_data = {
            "retailer_id": retailer_id,
            "generation_timestamp": datetime.now().isoformat(),
            "recommendation_summary": {
                "collaborative_count": len(recommendations.get('collaborative', [])),
                "category_expansion_count": len(recommendations.get('category_expansion', [])),
                "brand_loyalty_count": len(recommendations.get('brand_loyalty', [])),
                "total_recommendations": sum(len(recs) for recs in recommendations.values())
            },
            "recommendations": {}
        }
        
        # Convert each recommendation to dict
        for rec_type, rec_list in recommendations.items():
            export_data["recommendations"][rec_type] = [rec.to_dict() for rec in rec_list]
        
        # Save to file
        if not output_file:
            output_file = f"recommendations_{retailer_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2, default=str)
        
        print(f"💾 Recommendations exported to: {output_file}")
        return output_file
