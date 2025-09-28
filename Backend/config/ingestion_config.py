import os
from dataclasses import dataclass

@dataclass
class IngestionConfig:
    # Neo4j Configuration
    NEO4J_URI: str = "neo4j+s://your-instance.databases.neo4j.io"
    NEO4J_USERNAME: str = "neo4j"
    NEO4J_PASSWORD: str = "your-password"
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = "your-openai-api-key"
    
    # Data file paths
    RETAILERS_FILE: str = "mock_data/retailers.json"
    TRANSACTIONS_FILE: str = "mock_data/transactions.json"
    
    # Processing configuration
    BATCH_SIZE: int = 10  # Process documents in batches
    MAX_TOKENS_PER_DOCUMENT: int = 8000
    
    @classmethod
    def from_env(cls):
        """Load configuration from environment variables"""
        return cls(
            NEO4J_URI=os.getenv("NEO4J_URI", cls.NEO4J_URI),
            NEO4J_USERNAME=os.getenv("NEO4J_USERNAME", cls.NEO4J_USERNAME),
            NEO4J_PASSWORD=os.getenv("NEO4J_PASSWORD", cls.NEO4J_PASSWORD),
            OPENAI_API_KEY=os.getenv("OPENAI_API_KEY", cls.OPENAI_API_KEY),
            RETAILERS_FILE=os.getenv("RETAILERS_FILE", cls.RETAILERS_FILE),
            TRANSACTIONS_FILE=os.getenv("TRANSACTIONS_FILE", cls.TRANSACTIONS_FILE)
        )
