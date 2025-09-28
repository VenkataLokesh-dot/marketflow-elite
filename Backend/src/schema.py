from enum import Enum
from typing import Dict, List, Optional
from dataclasses import dataclass
from pydantic import BaseModel

class NodeType(Enum):
    RETAILER = "Retailer"
    PRODUCT = "Product"
    CATEGORY = "Category"
    SUPPLIER = "Supplier"
    BRAND = "Brand"
    LOCATION = "Location"
    PURCHASE_ORDER = "PurchaseOrder"

class RelationshipType(Enum):
    PURCHASES = "PURCHASES"
    SUPPLIES = "SUPPLIES"
    BELONGS_TO = "BELONGS_TO"
    LOCATED_IN = "LOCATED_IN"
    COMPETES_WITH = "COMPETES_WITH"
    FREQUENTLY_BOUGHT_WITH = "FREQUENTLY_BOUGHT_WITH"
    SUBSTITUTES = "SUBSTITUTES"
    SEASONAL_WITH = "SEASONAL_WITH"

class KGSchema(BaseModel):
    allowed_nodes: List[NodeType]
    allowed_relationships: List[RelationshipType]
    node_properties: Dict[str, List[str]]
    relationship_properties: Dict[str, List[str]]

# Schema definition for Qwipo B2B marketplace
QWIPO_SCHEMA = KGSchema(
    allowed_nodes=[node for node in NodeType],
    allowed_relationships=[rel for rel in RelationshipType],
    node_properties={
        "Retailer": ["business_type", "location", "size", "annual_revenue", "customer_segment"],
        "Product": ["price", "category", "brand", "unit", "margin_percent", "seasonal_factor"],
        "Supplier": ["rating", "location", "capacity", "certifications", "payment_terms"],
        "Brand": ["company", "market_share", "premium_factor"],
        "Category": ["growth_rate", "seasonality", "competition_level"]
    },
    relationship_properties={
        "PURCHASES": ["frequency", "quantity", "last_purchase_date", "total_value", "loyalty_score"],
        "FREQUENTLY_BOUGHT_WITH": ["confidence", "support", "lift", "seasonal_correlation"],
        "COMPETES_WITH": ["market_overlap", "price_similarity", "customer_switching_rate"]
    }
)

@dataclass
class GraphNode:
    id: str
    type: NodeType
    properties: Dict
    
@dataclass
class GraphEdge:
    source: str
    target: str
    relation: RelationshipType
    weight: float
    properties: Dict