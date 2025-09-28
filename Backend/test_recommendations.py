#!/usr/bin/env python3
"""
Qwipo Recommendation Engine Demo
Generates recommendations for sample retailers using the knowledge graph
"""

import sys
import os
import json
from dotenv import load_dotenv

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from recommendation_engine import QwipoRecommendationEngine

def display_recommendations(recommendations, rec_type):
    """Display recommendations in a formatted way"""
    print(f"\n🎯 {rec_type.upper().replace('_', ' ')} RECOMMENDATIONS")
    print("=" * 60)
    
    if not recommendations:
        print("   No recommendations found for this category.")
        return
    
    for i, rec in enumerate(recommendations[:5], 1):  # Show top 5
        print(f"\n{i}. 📦 {rec.product_name}")
        print(f"   Brand: {rec.brand} | Category: {rec.category}")
        print(f"   Confidence: {rec.confidence_score:.1%} | Type: {rec.recommendation_type}")
        
        if rec.price:
            print(f"   Price: ₹{rec.price:.0f}")
        if rec.profit_margin:
            print(f"   Profit Margin: {rec.profit_margin:.1f}%")
        if rec.supplier:
            print(f"   Supplier: {rec.supplier}")
        
        print("   📝 Reasoning:")
        for reason in rec.reasoning:
            print(f"      • {reason}")
        
        print("   📈 Graph Evidence:")
        for key, value in rec.graph_evidence.items():
            if key != "confidence_calculation":
                print(f"      • {key.replace('_', ' ').title()}: {value}")

def get_available_retailers(engine):
    """Get list of available retailers from the graph"""
    cypher = """
    MATCH (r:Retailer)
    RETURN r.id as retailer_id, r.name as retailer_name, 
           r.location as location, r.business_type as business_type,
           r.size as size
    ORDER BY r.name
    LIMIT 20
    """
    
    results = engine.neo4j_graph.query(cypher)
    return results

def main():
    print("🛒 QWIPO RECOMMENDATION ENGINE DEMO")
    print("Generating intelligent B2B product recommendations")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv(override=True)
    
    try:
        # Initialize recommendation engine
        print("🔧 Initializing recommendation engine...")
        engine = QwipoRecommendationEngine()
        
        # Get available retailers
        print("📂 Loading available retailers from knowledge graph...")
        retailers = get_available_retailers(engine)
        
        if not retailers:
            print("❌ No retailers found in the knowledge graph.")
            print("   Please run the ingestion pipeline first: python run_optimized_ingestion.py")
            return
        
        print(f"✅ Found {len(retailers)} retailers in the graph")
        
        # Display available retailers
        print("\n🏢 Available Retailers:")
        print("=" * 40)
        for i, retailer in enumerate(retailers[:10], 1):
            print(f"{i:2d}. {retailer['retailer_name']} ({retailer['retailer_id']})")
            print(f"    {retailer['business_type']} in {retailer['location']} | Size: {retailer['size']}")
        
        # Let user select a retailer or use default
        print("\n🎯 Select a retailer for recommendations:")
        print("Press Enter for default (first retailer) or type retailer number (1-10):")
        
        user_input = input("> ").strip()
        
        if user_input and user_input.isdigit():
            selected_idx = int(user_input) - 1
            if 0 <= selected_idx < len(retailers[:10]):
                selected_retailer = retailers[selected_idx]
            else:
                selected_retailer = retailers[0]
        else:
            selected_retailer = retailers[0]  # Default to first retailer
        
        retailer_id = selected_retailer['retailer_id']
        retailer_name = selected_retailer['retailer_name']
        
        print(f"\n✅ Selected: {retailer_name} ({retailer_id})")
        
        # Generate comprehensive recommendations
        print(f"\n🤖 Generating recommendations for {retailer_name}...")
        print("This may take a few moments...")
        
        recommendations = engine.get_comprehensive_recommendations(
            retailer_id=retailer_id,
            limit_per_type=5
        )
        
        # Display results
        print("\n" + "=" * 80)
        print(f"🎆 RECOMMENDATIONS FOR {retailer_name.upper()}")
        print("=" * 80)
        
        # Display each type of recommendation
        for rec_type, recs in recommendations.items():
            display_recommendations(recs, rec_type)
        
        # Summary
        total_recs = sum(len(recs) for recs in recommendations.values())
        print(f"\n\n📈 RECOMMENDATION SUMMARY")
        print("=" * 40)
        print(f"Total recommendations generated: {total_recs}")
        
        for rec_type, recs in recommendations.items():
            print(f"{rec_type.replace('_', ' ').title()}: {len(recs)} recommendations")
        
        # Ask if user wants to save results
        print("\n💾 Save recommendations to file? (y/n): ")
        save_choice = input("> ").strip().lower()
        
        if save_choice in ['y', 'yes']:
            output_file = engine.export_recommendations(recommendations, retailer_id)
            print(f"✅ Recommendations saved to: {output_file}")
        
        # Show sample queries for Neo4j Browser
        print("\n🔍 EXPLORE MORE IN NEO4J BROWSER:")
        print("=" * 40)
        print(f"1. View retailer network:")
        print(f"   MATCH (r:Retailer {{id: '{retailer_id}'}})-[:PURCHASES]->(p:Product) RETURN r, p LIMIT 25")
        print(f"\n2. Explore similar retailers:")
        print(f"   MATCH (r1:Retailer {{id: '{retailer_id}'}})-[:PURCHASES]->(p:Product)<-[:PURCHASES]-(r2:Retailer) RETURN r1, r2, p LIMIT 50")
        print(f"\n3. Browse product categories:")
        print(f"   MATCH (p:Product)-[:BELONGS_TO]->(c:Category) RETURN c.name, count(p) as products ORDER BY products DESC")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("   1. Ensure Neo4j is running and accessible")
        print("   2. Check your .env file configuration")
        print("   3. Verify the knowledge graph has data (run ingestion first)")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n⏹️ Demo stopped by user")
    except Exception as e:
        print(f"\n❌ Demo failed: {e}")
        sys.exit(1)
