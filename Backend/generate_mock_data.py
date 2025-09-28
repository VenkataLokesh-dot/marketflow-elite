#!/usr/bin/env python3
"""
Qwipo Knowledge Graph Recommendations - Mock Data Generation Demo

This script generates comprehensive mock data for the B2B marketplace recommendation system.
Focuses on creating realistic business patterns and relationships.
"""

import sys
import os
import json
from datetime import datetime

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from mock_data_generator import QwipoMockDataGenerator
from schema import QWIPO_SCHEMA

def main():
    print("=" * 60)
    print("🛒 QWIPO KNOWLEDGE GRAPH MOCK DATA GENERATOR")
    print("=" * 60)
    print()
    
    # Initialize generator
    print("🔧 Initializing mock data generator...")
    generator = QwipoMockDataGenerator()
    
    # Display schema information
    print("\n📋 Knowledge Graph Schema:")
    print(f"   Node Types: {[node.value for node in QWIPO_SCHEMA.allowed_nodes]}")
    print(f"   Relationship Types: {[rel.value for rel in QWIPO_SCHEMA.allowed_relationships]}")
    
    # Generate complete dataset
    print("\n🏭 Generating complete mock dataset...")
    dataset = generator.generate_complete_dataset()
    
    # Create output directory if it doesn't exist
    os.makedirs('mock_data', exist_ok=True)
    
    # Save main dataset
    print("\n💾 Saving datasets...")
    
    # 1. Complete dataset
    with open('mock_data/qwipo_complete_dataset.json', 'w') as f:
        json.dump(dataset, f, indent=2, default=str)
    print("   ✅ Complete dataset saved to mock_data/qwipo_complete_dataset.json")
    
    # 2. Retailers only
    with open('mock_data/retailers.json', 'w') as f:
        json.dump(dataset['retailers'], f, indent=2)
    print("   ✅ Retailers data saved to mock_data/retailers.json")
    
    # 3. Transactions only
    with open('mock_data/transactions.json', 'w') as f:
        json.dump(dataset['transactions'], f, indent=2, default=str)
    print("   ✅ Transactions data saved to mock_data/transactions.json")
    
    # 4. Product catalog
    with open('mock_data/product_catalog.json', 'w') as f:
        json.dump(dataset['product_catalog'], f, indent=2)
    print("   ✅ Product catalog saved to mock_data/product_catalog.json")
    
    # 5. Generate summary statistics
    generate_summary_report(dataset)
    
    # 6. Generate sample LLM input text
    generate_sample_llm_text(dataset)
    
    print("\n🎉 Mock data generation completed successfully!")
    print("\n📊 Dataset Summary:")
    print(f"   Total Retailers: {len(dataset['retailers'])}")
    print(f"   Total Transactions: {len(dataset['transactions'])}")
    print(f"   Total Brands: {len(dataset['product_catalog'])}")
    print(f"   Total Products: {sum(len(brand['products']) for brand in dataset['product_catalog'].values())}")
    
    # Show some sample data
    show_sample_data(dataset)

def generate_summary_report(dataset):
    """Generate a detailed summary report of the mock data"""
    
    summary = {
        "generation_date": datetime.now().isoformat(),
        "total_retailers": len(dataset['retailers']),
        "total_transactions": len(dataset['transactions']),
        "total_brands": len(dataset['product_catalog']),
        "retailer_distribution": {},
        "transaction_patterns": {},
        "top_products": [],
        "regional_distribution": {},
        "seasonal_insights": {}
    }
    
    # Analyze retailer distribution
    retailer_sizes = {}
    retailer_segments = {}
    retailer_locations = {}
    
    for retailer in dataset['retailers']:
        size = retailer['size']
        segment = retailer['customer_segment']
        location = retailer['location']
        
        retailer_sizes[size] = retailer_sizes.get(size, 0) + 1
        retailer_segments[segment] = retailer_segments.get(segment, 0) + 1
        retailer_locations[location] = retailer_locations.get(location, 0) + 1
    
    summary['retailer_distribution'] = {
        'by_size': retailer_sizes,
        'by_segment': retailer_segments,
        'by_location': retailer_locations
    }
    
    # Analyze transaction patterns
    product_sales = {}
    brand_sales = {}
    monthly_sales = {}
    
    for transaction in dataset['transactions']:
        product = transaction['product_name']
        brand = transaction['brand']
        month = transaction['purchase_date'][:7]  # YYYY-MM
        amount = transaction['total_amount']
        
        product_sales[product] = product_sales.get(product, 0) + amount
        brand_sales[brand] = brand_sales.get(brand, 0) + amount
        monthly_sales[month] = monthly_sales.get(month, 0) + amount
    
    # Top 10 products by sales
    top_products = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:10]
    summary['top_products'] = [{'product': p, 'total_sales': s} for p, s in top_products]
    
    # Top brands by sales
    top_brands = sorted(brand_sales.items(), key=lambda x: x[1], reverse=True)[:5]
    summary['top_brands'] = [{'brand': b, 'total_sales': s} for b, s in top_brands]
    
    # Monthly sales trend
    summary['monthly_sales_trend'] = dict(sorted(monthly_sales.items()))
    
    # Save summary report
    with open('mock_data/summary_report.json', 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    
    print("   ✅ Summary report saved to mock_data/summary_report.json")

def generate_sample_llm_text(dataset):
    """Generate sample text data that would be fed to LLM for entity extraction"""
    
    sample_transactions = dataset['transactions'][:20]  # First 20 transactions
    
    llm_text_samples = []
    
    for transaction in sample_transactions:
        # Create business transaction narrative
        text = f"""
Business Transaction Record #{transaction['transaction_id'][:8]}:

Retailer Information:
- Name: {transaction['retailer_name']}
- Type: {transaction.get('retailer_size', 'Medium')} {transaction.get('business_type', 'Grocery Store')}
- Location: {transaction['retailer_location']}
- Customer Segment: {transaction['retailer_segment']}

Product Details:
- Product: {transaction['product_name']}
- Brand: {transaction['brand']} (manufactured by {transaction['supplier']})
- Category: {transaction['category']} → {transaction['sub_category']}
- Unit Price: ₹{transaction['unit_price']} per {transaction.get('unit', 'piece')}

Transaction Details:
- Quantity Ordered: {transaction['quantity']} units
- Total Value: ₹{transaction['total_amount']}
- Purchase Date: {transaction['purchase_date'][:10]}
- Payment Terms: {transaction['payment_terms']}
- Profit Margin: {transaction['margin_percent']}%

Business Context:
- Product Popularity Score: {transaction['popularity_score']}/100
- Seasonal Factor: {transaction.get('seasonal_factor', 1.0)}
{'- Basket Purchase: Yes (bought with ' + transaction.get('anchor_product', '') + ')' if transaction.get('is_basket_item') else ''}

This transaction represents typical B2B purchasing behavior in the {transaction['category'].lower()} segment, 
where {transaction['retailer_segment'].lower()}-focused retailers in {transaction['retailer_location']} 
regularly source {transaction['sub_category'].lower()} products from established suppliers like {transaction['supplier']}.
"""
        llm_text_samples.append(text)
    
    # Combine all samples
    combined_text = "\n" + "="*80 + "\n".join(llm_text_samples)
    
    # Save LLM input samples
    with open('mock_data/sample_llm_input.txt', 'w', encoding='utf-8') as f:
        f.write(combined_text)
    
    print("   ✅ Sample LLM input text saved to mock_data/sample_llm_input.txt")

def show_sample_data(dataset):
    """Display sample data for verification"""
    
    print("\n📝 Sample Data Preview:")
    print("\n🏪 Sample Retailers:")
    for retailer in dataset['retailers'][:3]:
        print(f"   • {retailer['name']} ({retailer['size']}, {retailer['location']})")
        print(f"     Segment: {retailer['customer_segment']}, Revenue: ₹{retailer['annual_revenue']:,}")
    
    print("\n🛒 Sample Transactions:")
    for transaction in dataset['transactions'][:3]:
        print(f"   • {transaction['retailer_name']} bought {transaction['quantity']}x {transaction['product_name']}")
        print(f"     Total: ₹{transaction['total_amount']}, Date: {transaction['purchase_date'][:10]}")
    
    print("\n🏷️  Sample Products by Brand:")
    for brand_name, brand_info in list(dataset['product_catalog'].items())[:2]:
        print(f"   • {brand_name} ({brand_info['company']}) - {brand_info['category']}")
        for product in brand_info['products'][:2]:
            print(f"     - {product['name']}: ₹{product['price']} (Popularity: {product['popularity']})")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error during execution: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
