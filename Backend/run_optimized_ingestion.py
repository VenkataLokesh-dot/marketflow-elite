#!/usr/bin/env python3
"""
Optimized Qwipo Knowledge Graph Ingestion Pipeline
Processes documents in small batches for better performance
"""

import sys
import os
from dotenv import load_dotenv

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from optimized_ingestion_service import OptimizedQwipoIngestionService
from config.ingestion_config import IngestionConfig

def main():
    print("⚡ Optimized Qwipo Knowledge Graph Ingestion Pipeline")
    print("Processing in small batches for better performance")
    print("="*60)
    
    # Load environment variables
    load_dotenv(override=True)
    
    # Load configuration
    config = IngestionConfig.from_env()
    
    print(f"🔧 Configuration loaded:")
    print(f"   Neo4j URI: {config.NEO4J_URI}")
    print(f"   OpenAI API Key: {config.OPENAI_API_KEY[:20]}..." if config.OPENAI_API_KEY else "   OpenAI API Key: Not found")
    
    # Validate configuration
    if not config.OPENAI_API_KEY or config.OPENAI_API_KEY == "your-openai-api-key":
        print("❌ Please set OPENAI_API_KEY environment variable")
        sys.exit(1)
    
    if not config.NEO4J_PASSWORD or config.NEO4J_PASSWORD == "your-password":
        print("❌ Please set Neo4j credentials in .env file")
        sys.exit(1)
    
    # Check if data files exist
    if not os.path.exists(config.RETAILERS_FILE):
        print(f"❌ Retailers file not found: {config.RETAILERS_FILE}")
        print("   Please run 'python run_demo.py' first to generate mock data")
        sys.exit(1)
    
    if not os.path.exists(config.TRANSACTIONS_FILE):
        print(f"❌ Transactions file not found: {config.TRANSACTIONS_FILE}")
        print("   Please run 'python run_demo.py' first to generate mock data")
        sys.exit(1)
    
    try:
        # Initialize optimized ingestion service
        print("\n🔧 Initializing optimized ingestion service...")
        ingestion_service = OptimizedQwipoIngestionService(
            neo4j_uri=config.NEO4J_URI,
            neo4j_username=config.NEO4J_USERNAME,
            neo4j_password=config.NEO4J_PASSWORD,
            openai_api_key=config.OPENAI_API_KEY
        )
        
        # Run optimized ingestion pipeline with small batch size
        stats = ingestion_service.run_optimized_ingestion(
            retailers_file=config.RETAILERS_FILE,
            transactions_file=config.TRANSACTIONS_FILE,
            batch_size=3  # Small batch size for faster processing
        )
        
        print("\n🎉 OPTIMIZED INGESTION COMPLETED!")
        print("="*60)
        print("📈 Performance Improvements:")
        print("   ⚡ Batch processing for faster LLM calls")
        print("   📝 Lightweight documents to reduce token usage")
        print("   📊 Progress tracking with real-time stats")
        print("   🔄 Error recovery - continues on failures")
        print(f"\n📊 Final Statistics:")
        print(f"   🏢 Retailers processed: 50")
        print(f"   📦 Nodes created: {stats['nodes']}")
        print(f"   🔗 Relationships created: {stats['relationships']}")
        print("\n🚀 Your Knowledge Graph is ready for recommendations!")
        print("\n🔍 Sample Cypher Queries to try:")
        print("   MATCH (r:Retailer) RETURN r.name, r.location LIMIT 10")
        print("   MATCH (r:Retailer)-[:PURCHASES]->(p:Product) RETURN r.name, p.name LIMIT 10")
        print("   MATCH (p:Product)-[:BELONGS_TO]->(b:Brand) RETURN b.name, count(p) as products")
        
    except KeyboardInterrupt:
        print("\n⏹️ Ingestion stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ OPTIMIZED INGESTION FAILED: {e}")
        print("\n🔧 Troubleshooting:")
        print("   1. Check your Neo4j Aura connection")
        print("   2. Verify OpenAI API key")
        print("   3. Ensure mock data files exist")
        print("   4. Check internet connectivity")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
