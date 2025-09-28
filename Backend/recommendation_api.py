#!/usr/bin/env python3
"""
FastAPI wrapper for Qwipo Recommendation Service
Provides RESTful endpoints for the Neo4j-powered recommendation engine
"""

import sys
import os
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import uvicorn

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from recommendation_engine import QwipoRecommendationEngine, Recommendation

# Load environment variables
load_dotenv(override=True)

# Initialize FastAPI app
app = FastAPI(
    title="Qwipo Knowledge Graph Recommendations API",
    description="B2B marketplace recommendation system powered by Neo4j knowledge graph",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Global recommendation engine instance
recommendation_engine = None

# Pydantic models for API requests/responses
class RecommendationResponse(BaseModel):
    """Response model for individual recommendations"""
    product_name: str
    brand: str
    category: str
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    reasoning: List[str]
    recommendation_type: str
    graph_evidence: Dict[str, Any]
    price: Optional[float] = None
    profit_margin: Optional[float] = None
    supplier: Optional[str] = None

class ComprehensiveRecommendationsResponse(BaseModel):
    """Response model for comprehensive recommendations"""
    retailer_id: str
    retailer_profile: Dict[str, Any]
    recommendations: Dict[str, List[RecommendationResponse]]
    generated_at: str
    total_recommendations: int

class RetailerInfo(BaseModel):
    """Response model for retailer information"""
    retailer_id: str
    retailer_name: str
    location: str
    business_type: str
    size: str

class RetailersListResponse(BaseModel):
    """Response model for retailers list"""
    retailers: List[RetailerInfo]
    total_count: int

class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    service: str
    neo4j_connected: bool
    timestamp: str

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the recommendation engine on startup"""
    global recommendation_engine
    try:
        recommendation_engine = QwipoRecommendationEngine()
        print("✅ Recommendation engine initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize recommendation engine: {e}")
        raise

# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check the health of the recommendation service"""
    neo4j_connected = True
    try:
        # Test Neo4j connection with a simple query
        result = recommendation_engine.neo4j_graph.query("MATCH (n) RETURN count(n) as total LIMIT 1")
        neo4j_connected = len(result) > 0
    except Exception:
        neo4j_connected = False
    
    return HealthResponse(
        status="healthy" if neo4j_connected else "degraded",
        service="Qwipo Recommendation API",
        neo4j_connected=neo4j_connected,
        timestamp=datetime.now().isoformat()
    )

# Get available retailers
@app.get("/retailers", response_model=RetailersListResponse, tags=["Retailers"])
async def get_retailers(
    limit: int = Query(20, ge=1, le=100, description="Maximum number of retailers to return")
):
    """Get list of available retailers from the knowledge graph"""
    try:
        cypher = """
        MATCH (r:Retailer)
        RETURN r.id as retailer_id, r.name as retailer_name, 
               r.location as location, r.business_type as business_type,
               r.size as size
        ORDER BY r.name
        LIMIT $limit
        """
        results = recommendation_engine.neo4j_graph.query(cypher, params={"limit": limit})
        
        retailers = [
            RetailerInfo(
                retailer_id=row["retailer_id"],
                retailer_name=row["retailer_name"],
                location=row["location"],
                business_type=row["business_type"],
                size=row["size"]
            )
            for row in results
        ]
        
        return RetailersListResponse(
            retailers=retailers,
            total_count=len(retailers)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch retailers: {str(e)}")

# Get retailer profile
@app.get("/retailers/{retailer_id}/profile", tags=["Retailers"])
async def get_retailer_profile(
    retailer_id: str = Path(..., description="Retailer ID from the knowledge graph")
):
    """Get detailed profile information for a specific retailer"""
    try:
        profile = recommendation_engine.get_retailer_profile(retailer_id)
        if not profile:
            raise HTTPException(status_code=404, detail=f"Retailer {retailer_id} not found")
        return profile
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=f"Retailer {retailer_id} not found")
        raise HTTPException(status_code=500, detail=f"Failed to fetch retailer profile: {str(e)}")

# Get comprehensive recommendations
@app.get("/retailers/{retailer_id}/recommendations", 
         response_model=ComprehensiveRecommendationsResponse, 
         tags=["Recommendations"])
async def get_comprehensive_recommendations(
    retailer_id: str = Path(..., description="Retailer ID from the knowledge graph"),
    limit_per_type: int = Query(5, ge=1, le=20, description="Maximum recommendations per type")
):
    """Get comprehensive recommendations for a retailer using all available algorithms"""
    try:
        # Get retailer profile first
        profile = recommendation_engine.get_retailer_profile(retailer_id)
        if not profile:
            raise HTTPException(status_code=404, detail=f"Retailer {retailer_id} not found")
        
        # Get recommendations
        recommendations = recommendation_engine.get_comprehensive_recommendations(
            retailer_id=retailer_id,
            limit_per_type=limit_per_type
        )
        
        # Convert recommendations to response format
        formatted_recommendations = {}
        total_count = 0
        
        for rec_type, recs in recommendations.items():
            formatted_recommendations[rec_type] = [
                RecommendationResponse(**rec.to_dict()) for rec in recs
            ]
            total_count += len(recs)
        
        return ComprehensiveRecommendationsResponse(
            retailer_id=retailer_id,
            retailer_profile=profile,
            recommendations=formatted_recommendations,
            generated_at=datetime.now().isoformat(),
            total_recommendations=total_count
        )
        
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=f"Retailer {retailer_id} not found")
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

# Get specific recommendation type
@app.get("/retailers/{retailer_id}/recommendations/{recommendation_type}", 
         tags=["Recommendations"])
async def get_specific_recommendations(
    retailer_id: str = Path(..., description="Retailer ID from the knowledge graph"),
    recommendation_type: str = Path(..., description="Type of recommendations (collaborative, category_expansion, etc.)"),
    limit: int = Query(5, ge=1, le=20, description="Maximum number of recommendations")
):
    """Get specific type of recommendations for a retailer"""
    try:
        # Get all recommendations and filter for the requested type
        all_recommendations = recommendation_engine.get_comprehensive_recommendations(
            retailer_id=retailer_id,
            limit_per_type=limit
        )
        
        if recommendation_type not in all_recommendations:
            available_types = list(all_recommendations.keys())
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid recommendation type. Available types: {available_types}"
            )
        
        recommendations = all_recommendations[recommendation_type]
        
        return {
            "retailer_id": retailer_id,
            "recommendation_type": recommendation_type,
            "recommendations": [rec.to_dict() for rec in recommendations],
            "count": len(recommendations),
            "generated_at": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """API root endpoint with basic information"""
    return {
        "service": "Qwipo Knowledge Graph Recommendations API",
        "version": "1.0.0",
        "description": "B2B marketplace recommendation system powered by Neo4j",
        "endpoints": {
            "health": "/health",
            "retailers": "/retailers",
            "retailer_profile": "/retailers/{retailer_id}/profile",
            "comprehensive_recommendations": "/retailers/{retailer_id}/recommendations",
            "specific_recommendations": "/retailers/{retailer_id}/recommendations/{type}",
            "documentation": "/docs"
        }
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found", "path": str(request.url)}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "path": str(request.url)}
    )

if __name__ == "__main__":
    # Run the FastAPI server
    print("🚀 Starting Qwipo Recommendation API Server...")
    print("📊 Powered by Neo4j Knowledge Graph")
    print("🌐 API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        "recommendation_api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )