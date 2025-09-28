#!/usr/bin/env python3
"""
Startup script for Qwipo Recommendation API
"""

import os
import sys
from dotenv import load_dotenv

def main():
    print("🚀 QWIPO RECOMMENDATION API")
    print("Neo4j-powered B2B marketplace recommendations")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv(override=True)
    
    # Check required environment variables
    required_vars = ["NEO4J_URI", "NEO4J_PASSWORD", "OPENAI_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these in your .env file")
        sys.exit(1)
    
    print("✅ Environment variables loaded")
    print(f"   Neo4j URI: {os.getenv('NEO4J_URI')}")
    print(f"   OpenAI API Key: {os.getenv('OPENAI_API_KEY')[:20]}...")
    
    print("\n🌐 Starting FastAPI server...")
    print("   API will be available at: http://localhost:8000")
    print("   Documentation: http://localhost:8000/docs")
    print("   Alternative docs: http://localhost:8000/redoc")
    
    # Import and run the FastAPI app
    try:
        import uvicorn
        uvicorn.run(
            "recommendation_api:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except ImportError:
        print("❌ FastAPI dependencies not installed")
        print("   Run: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()