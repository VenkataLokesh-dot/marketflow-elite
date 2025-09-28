import os
import json
from typing import List, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
import time
from tqdm import tqdm

from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
try:
    from langchain_neo4j import Neo4jGraph
except ImportError:
    from langchain_community.graphs import Neo4jGraph

from schema import NodeType, RelationshipType

class OptimizedQwipoIngestionService:
    def __init__(self, neo4j_uri: str, neo4j_username: str, neo4j_password: str, openai_api_key: str):
        """Initialize the ingestion service with Neo4j and OpenAI connections"""
        
        # Load environment variables
        load_dotenv(override=True)
        
        # Set up OpenAI API key
        os.environ["OPENAI_API_KEY"] = openai_api_key
        print(f"🔑 Using OpenAI API key: {openai_api_key[:20]}...")
        
        # Initialize LLM with specific model for better entity extraction
        self.llm = ChatOpenAI(
            temperature=0, 
            model="gpt-4o-mini",
            max_tokens=4000,  # Limit response size
            timeout=60  # Add timeout
        )
        
        # Set up Neo4j connection
        self.neo4j_graph = Neo4jGraph(
            url=neo4j_uri,
            username=neo4j_username,
            password=neo4j_password
        )
        
        # Configure LLM Graph Transformer with Qwipo-specific schema
        self.llm_transformer = LLMGraphTransformer(
            llm=self.llm,
            allowed_nodes=[node.value for node in NodeType],
            allowed_relationships=[rel.value for rel in RelationshipType],
            node_properties=[
                "name", "business_type", "location", "size", "annual_revenue",
                "price", "category", "brand", "quantity", "total_amount", "margin"
            ]
        )
        
        # Create constraints and indexes for better performance
        self._setup_database_constraints()
    
    def _setup_database_constraints(self):
        """Create unique constraints and indexes in Neo4j"""
        constraints = [
            "CREATE CONSTRAINT retailer_id IF NOT EXISTS FOR (r:Retailer) REQUIRE r.id IS UNIQUE",
            "CREATE CONSTRAINT product_name IF NOT EXISTS FOR (p:Product) REQUIRE p.name IS UNIQUE",
            "CREATE CONSTRAINT brand_name IF NOT EXISTS FOR (b:Brand) REQUIRE b.name IS UNIQUE",
            "CREATE CONSTRAINT supplier_name IF NOT EXISTS FOR (s:Supplier) REQUIRE s.name IS UNIQUE",
            "CREATE CONSTRAINT category_name IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE",
            "CREATE CONSTRAINT location_name IF NOT EXISTS FOR (l:Location) REQUIRE l.name IS UNIQUE"
        ]
        
        for constraint in constraints:
            try:
                self.neo4j_graph.query(constraint)
                print(f"✅ Created constraint: {constraint.split('FOR')[1].split('REQUIRE')[0].strip()}")
            except Exception as e:
                print(f"⚠️ Constraint may already exist: {e}")
    
    def prepare_lightweight_documents(self, retailers_data: List[Dict], transactions_data: List[Dict], limit_transactions: int = 3) -> List[Document]:
        """Create lighter documents for faster LLM processing"""
        documents = []
        
        # Group transactions by retailer
        retailer_transactions = {}
        for transaction in transactions_data:
            retailer_id = transaction['retailer_id']
            if retailer_id not in retailer_transactions:
                retailer_transactions[retailer_id] = []
            retailer_transactions[retailer_id].append(transaction)
        
        print(f"📝 Creating lightweight documents (max {limit_transactions} transactions per retailer)...")
        
        for retailer in retailers_data:
            retailer_id = retailer['id']
            transactions = retailer_transactions.get(retailer_id, [])[:limit_transactions]  # Limit transactions
            
            # Create concise context text
            text_content = f"""
Retailer: {retailer['name']} (ID: {retailer['id']})
Type: {retailer['business_type']} in {retailer['location']}
Size: {retailer['size']}, Revenue: ₹{retailer['annual_revenue']:,}
Customer Segment: {retailer['customer_segment']}

Recent Purchases:"""
            
            # Add limited transaction details
            for i, transaction in enumerate(transactions):
                text_content += f"""
{i+1}. {transaction['product_name']} ({transaction['brand']}) - {transaction['category']}
   Qty: {transaction['quantity']}, Amount: ₹{transaction['total_amount']}
   Supplier: {transaction['supplier']}, Date: {transaction['purchase_date'][:10]}"""
            
            # Create document
            doc = Document(
                page_content=text_content,
                metadata={
                    'retailer_id': retailer_id,
                    'retailer_name': retailer['name'],
                    'location': retailer['location'],
                    'transaction_count': len(transactions)
                }
            )
            documents.append(doc)
        
        return documents
    
    def extract_graph_documents_batch(self, documents: List[Document], batch_size: int = 5):
        """Process documents in batches with progress tracking"""
        print(f"🔄 Processing {len(documents)} documents in batches of {batch_size}...")
        
        all_graph_documents = []
        total_batches = (len(documents) + batch_size - 1) // batch_size
        
        with tqdm(total=len(documents), desc="Processing documents") as pbar:
            for i in range(0, len(documents), batch_size):
                batch = documents[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                
                print(f"\n📦 Processing batch {batch_num}/{total_batches} ({len(batch)} documents)...")
                
                try:
                    start_time = time.time()
                    batch_graph_docs = self.llm_transformer.convert_to_graph_documents(batch)
                    processing_time = time.time() - start_time
                    
                    all_graph_documents.extend(batch_graph_docs)
                    
                    # Show batch stats
                    total_nodes = sum(len(doc.nodes) for doc in batch_graph_docs)
                    total_rels = sum(len(doc.relationships) for doc in batch_graph_docs)
                    
                    print(f"✅ Batch {batch_num} completed in {processing_time:.1f}s")
                    print(f"   📊 Extracted: {total_nodes} nodes, {total_rels} relationships")
                    
                    pbar.update(len(batch))
                    
                    # Small delay to avoid rate limits
                    time.sleep(1)
                    
                except Exception as e:
                    print(f"❌ Error in batch {batch_num}: {e}")
                    print("🔄 Continuing with next batch...")
                    pbar.update(len(batch))
                    continue
        
        print(f"\n✅ All batches processed! Total graph documents: {len(all_graph_documents)}")
        return all_graph_documents
    
    def ingest_graph_documents_optimized(self, graph_documents):
        """Optimized ingestion with batch processing"""
        print(f"🔄 Ingesting {len(graph_documents)} graph documents into Neo4j...")
        
        total_nodes = 0
        total_relationships = 0
        
        try:
            with tqdm(total=len(graph_documents), desc="Ingesting to Neo4j") as pbar:
                for i, graph_doc in enumerate(graph_documents):
                    # Batch nodes
                    node_queries = []
                    for node in graph_doc.nodes:
                        properties = dict(node.properties) if node.properties else {}
                        node_queries.append({
                            "query": f"""
                            MERGE (n:{node.type} {{id: $id}})
                            SET n.name = $name
                            SET n += $properties
                            """,
                            "params": {
                                "id": node.id,
                                "name": node.id,
                                "properties": properties
                            }
                        })
                    
                    # Execute node queries
                    for node_query in node_queries:
                        self.neo4j_graph.query(node_query["query"], node_query["params"])
                        total_nodes += 1
                    
                    # Batch relationships
                    rel_queries = []
                    for rel in graph_doc.relationships:
                        properties = dict(rel.properties) if rel.properties else {}
                        rel_queries.append({
                            "query": f"""
                            MATCH (source:{rel.source.type} {{id: $source_id}})
                            MATCH (target:{rel.target.type} {{id: $target_id}})
                            MERGE (source)-[r:{rel.type}]->(target)
                            SET r += $properties
                            """,
                            "params": {
                                "source_id": rel.source.id,
                                "target_id": rel.target.id,
                                "properties": properties
                            }
                        })
                    
                    # Execute relationship queries
                    for rel_query in rel_queries:
                        self.neo4j_graph.query(rel_query["query"], rel_query["params"])
                        total_relationships += 1
                    
                    pbar.update(1)
            
            print(f"✅ Successfully ingested:")
            print(f"   📦 {total_nodes} nodes")
            print(f"   🔗 {total_relationships} relationships")
            
            return {"nodes": total_nodes, "relationships": total_relationships}
            
        except Exception as e:
            print(f"❌ Error during Neo4j ingestion: {e}")
            raise
    
    def run_optimized_ingestion(self, retailers_file: str, transactions_file: str, batch_size: int = 5):
        """Run the optimized ingestion pipeline"""
        print("🚀 Starting Optimized Qwipo Knowledge Graph Ingestion Pipeline")
        print("="*60)
        
        # Load data
        print("📂 Loading mock data...")
        with open(retailers_file, 'r') as f:
            retailers_data = json.load(f)
        
        with open(transactions_file, 'r') as f:
            transactions_data = json.load(f)
        
        print(f"✅ Loaded {len(retailers_data)} retailers and {len(transactions_data)} transactions")
        
        # Prepare lightweight documents
        print("\n📝 Preparing lightweight documents for LLM processing...")
        documents = self.prepare_lightweight_documents(retailers_data, transactions_data, limit_transactions=3)
        print(f"✅ Prepared {len(documents)} lightweight documents")
        
        # Extract graph documents in batches
        print(f"\n🤖 Extracting entities and relationships using LLM (batch size: {batch_size})...")
        graph_documents = self.extract_graph_documents_batch(documents, batch_size=batch_size)
        
        # Ingest into Neo4j
        print("\n📊 Ingesting into Neo4j Knowledge Graph...")
        ingestion_stats = self.ingest_graph_documents_optimized(graph_documents)
        
        print("\n🎉 Optimized ingestion pipeline completed successfully!")
        print(f"📈 Final Stats: {ingestion_stats}")
        
        return ingestion_stats
