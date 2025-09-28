import random
import json
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import pandas as pd
from dataclasses import asdict

class QwipoMockDataGenerator:
    def __init__(self):
        self.product_catalog = self._load_product_catalog()
        self.locations = [
            "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
            "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
        ]
        self.business_types = [
            "Grocery Store", "Supermarket", "Convenience Store", 
            "Wholesale Distributor", "Mini Mart", "Departmental Store"
        ]
        self.payment_terms = ["Cash", "Credit_15", "Credit_30", "Credit_45"]
        
    def _load_product_catalog(self):
        """Load the comprehensive product catalog with all brands and products"""
        return {
            "Taj Mahal": {
                "company": "HUL",
                "category": "Beverages",
                "sub_category": "Tea",
                "market_share": 25,
                "products": [
                    {"name": "Taj Mahal Tea Strong", "price": 250, "unit": "500g", "margin": 15, "popularity": 90},
                    {"name": "Taj Mahal Gold Tea", "price": 300, "unit": "500g", "margin": 18, "popularity": 85},
                    {"name": "Taj Mahal Green Tea", "price": 180, "unit": "100 bags", "margin": 20, "popularity": 70},
                    {"name": "Taj Mahal Masala Chai", "price": 220, "unit": "500g", "margin": 16, "popularity": 80},
                    {"name": "Taj Mahal Classic Tea Bags", "price": 150, "unit": "100 bags", "margin": 22, "popularity": 75},
                    {"name": "Taj Mahal Rich Taste Tea", "price": 280, "unit": "500g", "margin": 17, "popularity": 82},
                    {"name": "Taj Mahal Premium Dust Tea", "price": 200, "unit": "500g", "margin": 14, "popularity": 65},
                    {"name": "Taj Mahal Special Leaf Tea", "price": 320, "unit": "500g", "margin": 19, "popularity": 60},
                    {"name": "Taj Mahal Chai Moments", "price": 120, "unit": "10 sachets", "margin": 25, "popularity": 88},
                    {"name": "Taj Mahal Royal Blend", "price": 350, "unit": "500g", "margin": 20, "popularity": 55}
                ]
            },
            "Maggi": {
                "company": "Nestlé",
                "category": "Food",
                "sub_category": "Instant Food",
                "market_share": 60,
                "products": [
                    {"name": "Maggi 2-Minute Masala Noodles", "price": 14, "unit": "70g", "margin": 30, "popularity": 95},
                    {"name": "Maggi Hot & Sweet Sauce", "price": 45, "unit": "200g", "margin": 25, "popularity": 78},
                    {"name": "Maggi Tomato Ketchup", "price": 85, "unit": "500g", "margin": 28, "popularity": 82},
                    {"name": "Maggi Chicken Noodles", "price": 16, "unit": "70g", "margin": 30, "popularity": 85},
                    {"name": "Maggi Atta Noodles", "price": 18, "unit": "70g", "margin": 28, "popularity": 75},
                    {"name": "Maggi Oats Noodles", "price": 22, "unit": "70g", "margin": 32, "popularity": 65},
                    {"name": "Maggi Yummy Masala Aata Noodles", "price": 20, "unit": "70g", "margin": 29, "popularity": 70},
                    {"name": "Maggi Veg Atta Masala", "price": 19, "unit": "70g", "margin": 28, "popularity": 68},
                    {"name": "Maggi Soup Mixes", "price": 35, "unit": "50g", "margin": 35, "popularity": 60},
                    {"name": "Maggi Seasoning Cubes", "price": 25, "unit": "8 cubes", "margin": 40, "popularity": 55}
                ]
            },
            "Britannia": {
                "company": "Britannia Industries",
                "category": "Food",
                "sub_category": "Biscuits & Bakery",
                "market_share": 35,
                "products": [
                    {"name": "Good Day Biscuits", "price": 35, "unit": "150g", "margin": 25, "popularity": 88},
                    {"name": "Bourbon", "price": 45, "unit": "200g", "margin": 22, "popularity": 85},
                    {"name": "Jim Jam", "price": 40, "unit": "150g", "margin": 24, "popularity": 80},
                    {"name": "Marie Gold", "price": 30, "unit": "200g", "margin": 20, "popularity": 92},
                    {"name": "NutriChoice Digestive", "price": 55, "unit": "200g", "margin": 28, "popularity": 70},
                    {"name": "Little Hearts", "price": 25, "unit": "100g", "margin": 30, "popularity": 85},
                    {"name": "Treat Biscuits", "price": 35, "unit": "150g", "margin": 26, "popularity": 75},
                    {"name": "Britannia Rusk", "price": 50, "unit": "300g", "margin": 18, "popularity": 65},
                    {"name": "Britannia Bread", "price": 28, "unit": "400g", "margin": 15, "popularity": 90},
                    {"name": "Britannia Cake", "price": 120, "unit": "500g", "margin": 35, "popularity": 60}
                ]
            },
            "Parle": {
                "company": "Parle Products",
                "category": "Food",
                "sub_category": "Biscuits & Snacks",
                "market_share": 30,
                "products": [
                    {"name": "Parle-G", "price": 25, "unit": "200g", "margin": 20, "popularity": 98},
                    {"name": "Monaco", "price": 30, "unit": "150g", "margin": 22, "popularity": 85},
                    {"name": "KrackJack", "price": 35, "unit": "200g", "margin": 24, "popularity": 80},
                    {"name": "Hide & Seek", "price": 45, "unit": "200g", "margin": 26, "popularity": 88},
                    {"name": "Kismi Toffee", "price": 15, "unit": "100g", "margin": 35, "popularity": 75},
                    {"name": "Melody Chocolate", "price": 20, "unit": "150g", "margin": 38, "popularity": 70},
                    {"name": "20-20 Cookies", "price": 40, "unit": "200g", "margin": 25, "popularity": 82},
                    {"name": "Milano Cookies", "price": 50, "unit": "200g", "margin": 28, "popularity": 65},
                    {"name": "Mango Bite", "price": 18, "unit": "100g", "margin": 40, "popularity": 78},
                    {"name": "Fab! Biscuits", "price": 32, "unit": "150g", "margin": 23, "popularity": 72}
                ]
            },
            "Colgate": {
                "company": "Colgate-Palmolive",
                "category": "Personal Care",
                "sub_category": "Oral Care",
                "market_share": 55,
                "products": [
                    {"name": "Colgate Strong Teeth", "price": 85, "unit": "200g", "margin": 35, "popularity": 90},
                    {"name": "Colgate Max Fresh", "price": 95, "unit": "200g", "margin": 38, "popularity": 85},
                    {"name": "Colgate Total", "price": 110, "unit": "200g", "margin": 40, "popularity": 80},
                    {"name": "Colgate Visible White", "price": 120, "unit": "200g", "margin": 42, "popularity": 75},
                    {"name": "Colgate Active Salt", "price": 75, "unit": "200g", "margin": 32, "popularity": 88},
                    {"name": "Colgate Kids Toothpaste", "price": 65, "unit": "100g", "margin": 45, "popularity": 70},
                    {"name": "Colgate Sensitive", "price": 130, "unit": "200g", "margin": 45, "popularity": 65},
                    {"name": "Colgate Herbal", "price": 80, "unit": "200g", "margin": 35, "popularity": 72},
                    {"name": "Colgate ZigZag Toothbrush", "price": 45, "unit": "1 piece", "margin": 50, "popularity": 85},
                    {"name": "Colgate Plax Mouthwash", "price": 180, "unit": "500ml", "margin": 38, "popularity": 68}
                ]
            },
            "Dettol": {
                "company": "Reckitt",
                "category": "Healthcare",
                "sub_category": "Antiseptic & Hygiene",
                "market_share": 45,
                "products": [
                    {"name": "Dettol Antiseptic Liquid", "price": 220, "unit": "550ml", "margin": 32, "popularity": 92},
                    {"name": "Dettol Soap – Original", "price": 45, "unit": "125g", "margin": 40, "popularity": 88},
                    {"name": "Dettol Soap – Cool", "price": 48, "unit": "125g", "margin": 42, "popularity": 85},
                    {"name": "Dettol Soap – Skincare", "price": 52, "unit": "125g", "margin": 44, "popularity": 80},
                    {"name": "Dettol Hand Sanitizer", "price": 85, "unit": "200ml", "margin": 45, "popularity": 90},
                    {"name": "Dettol Hand Wash (Original)", "price": 95, "unit": "250ml", "margin": 38, "popularity": 82},
                    {"name": "Dettol Hand Wash (Skincare)", "price": 105, "unit": "250ml", "margin": 40, "popularity": 78},
                    {"name": "Dettol Multi-Use Wipes", "price": 75, "unit": "40 wipes", "margin": 48, "popularity": 70},
                    {"name": "Dettol Liquid Handwash Refill", "price": 120, "unit": "750ml", "margin": 35, "popularity": 75},
                    {"name": "Dettol Disinfectant Spray", "price": 180, "unit": "450ml", "margin": 42, "popularity": 68}
                ]
            }
        }
    
    def generate_retailer_profiles(self, num_retailers=50):
        """Generate diverse retailer profiles with realistic business characteristics"""
        retailers = []
        
        retailer_base_names = [
            "Raj General Store", "City Mart", "Fresh Bazaar", "Quick Stop", "Mega Mart",
            "Local Grocery", "Super Saver", "Corner Shop", "Smart Store", "Daily Needs",
            "Wholesale Hub", "Metro Store", "Family Mart", "Express Store", "Prime Shop",
            "Sunrise Stores", "Golden Grocery", "New Market", "Central Bazaar", "Elite Store"
        ]
        
        for i in range(num_retailers):
            base_name = retailer_base_names[i % len(retailer_base_names)]
            location = random.choice(self.locations)
            
            retailer = {
                "id": f"retailer_{i+1:03d}",
                "name": f"{base_name} - {location}" if i >= len(retailer_base_names) else base_name,
                "business_type": random.choice(self.business_types),
                "location": location,
                "size": random.choices(
                    ["Small", "Medium", "Large"],
                    weights=[50, 35, 15],  # More small stores
                    k=1
                )[0],
                "annual_revenue": self._calculate_revenue_by_size(random.choice(["Small", "Medium", "Large"])),
                "established_year": random.randint(2010, 2023),
                "customer_segment": random.choices(
                    ["Budget", "Mid-range", "Premium"],
                    weights=[40, 45, 15],
                    k=1
                )[0],
                "store_area": random.randint(200, 2000),  # sq ft
                "monthly_footfall": random.randint(500, 5000)
            }
            retailers.append(retailer)
        
        return retailers
    
    def _calculate_revenue_by_size(self, size):
        """Calculate realistic revenue based on store size"""
        revenue_ranges = {
            "Small": (300000, 1200000),
            "Medium": (1200000, 5000000),
            "Large": (5000000, 20000000)
        }
        min_rev, max_rev = revenue_ranges[size]
        return random.randint(min_rev, max_rev)
    
    def generate_purchase_transactions(self, retailers, num_transactions=2000):
        """Generate realistic purchase transactions with business logic"""
        transactions = []
        
        # Define seasonal multipliers
        seasonal_patterns = self._get_seasonal_patterns()
        
        # Define frequently bought together patterns
        basket_patterns = self._get_market_basket_patterns()
        
        for _ in range(num_transactions):
            retailer = random.choice(retailers)
            
            # Generate transaction date with seasonal bias
            transaction_date = self._generate_seasonal_date()
            month = transaction_date.month
            
            # Select brand and product based on retailer characteristics
            brand_name, product = self._select_product_for_retailer(retailer, month, seasonal_patterns)
            
            # Calculate realistic quantity
            base_quantity = self._calculate_base_quantity(retailer, product)
            seasonal_multiplier = seasonal_patterns.get(product["name"], {}).get(month, 1.0)
            final_quantity = max(1, int(base_quantity * seasonal_multiplier))
            
            transaction = {
                "transaction_id": str(uuid.uuid4()),
                "retailer_id": retailer["id"],
                "retailer_name": retailer["name"],
                "retailer_size": retailer["size"],
                "retailer_location": retailer["location"],
                "retailer_segment": retailer["customer_segment"],
                "product_name": product["name"],
                "brand": brand_name,
                "category": self.product_catalog[brand_name]["category"],
                "sub_category": self.product_catalog[brand_name]["sub_category"],
                "supplier": self.product_catalog[brand_name]["company"],
                "unit_price": product["price"],
                "quantity": final_quantity,
                "total_amount": product["price"] * final_quantity,
                "margin_percent": product["margin"],
                "purchase_date": transaction_date.isoformat(),
                "payment_terms": self._select_payment_terms(retailer, product["price"] * final_quantity),
                "popularity_score": product["popularity"],
                "seasonal_factor": seasonal_multiplier
            }
            transactions.append(transaction)
            
            # Generate complementary purchases based on basket patterns
            if random.random() < 0.3:  # 30% chance of basket purchase
                complementary_transactions = self._generate_basket_purchases(
                    retailer, product["name"], transaction_date, basket_patterns
                )
                transactions.extend(complementary_transactions)
        
        return transactions
    
    def _get_seasonal_patterns(self):
        """Define seasonal buying patterns for products"""
        return {
            # Tea products peak in winter months
            "Taj Mahal Tea Strong": {10: 1.4, 11: 1.6, 12: 1.8, 1: 1.7, 2: 1.5},
            "Taj Mahal Masala Chai": {10: 1.5, 11: 1.7, 12: 1.9, 1: 1.8, 2: 1.6},
            
            # Noodles peak during monsoon and winter
            "Maggi 2-Minute Masala Noodles": {6: 1.3, 7: 1.4, 8: 1.5, 9: 1.3, 12: 1.2, 1: 1.2},
            
            # Biscuits peak during festivals
            "Britannia Cake": {10: 1.8, 11: 2.0, 12: 2.2, 4: 1.3},  # Diwali and other festivals
            "Good Day Biscuits": {10: 1.3, 11: 1.4, 12: 1.5, 4: 1.2},
            
            # Health products peak during monsoon
            "Dettol Antiseptic Liquid": {6: 1.4, 7: 1.6, 8: 1.8, 9: 1.5},
            "Dettol Hand Sanitizer": {6: 1.3, 7: 1.5, 8: 1.7, 9: 1.4}
        }
    
    def _get_market_basket_patterns(self):
        """Define frequently bought together patterns"""
        return {
            "Maggi 2-Minute Masala Noodles": [
                {"product": "Maggi Hot & Sweet Sauce", "probability": 0.4},
                {"product": "Maggi Tomato Ketchup", "probability": 0.3}
            ],
            "Taj Mahal Tea Strong": [
                {"product": "Marie Gold", "probability": 0.5},
                {"product": "Parle-G", "probability": 0.4},
                {"product": "Good Day Biscuits", "probability": 0.3}
            ],
            "Dettol Antiseptic Liquid": [
                {"product": "Dettol Soap – Original", "probability": 0.6},
                {"product": "Dettol Hand Wash (Original)", "probability": 0.4}
            ],
            "Colgate Strong Teeth": [
                {"product": "Colgate ZigZag Toothbrush", "probability": 0.3},
                {"product": "Colgate Plax Mouthwash", "probability": 0.2}
            ]
        }
    
    def _generate_seasonal_date(self):
        """Generate dates with realistic seasonal distribution"""
        start_date = datetime.now() - timedelta(days=365)
        
        # Bias towards recent months (higher business activity)
        recent_bias = random.random()
        if recent_bias < 0.4:  # 40% recent transactions
            days_back = random.randint(0, 90)
        elif recent_bias < 0.7:  # 30% medium recent
            days_back = random.randint(90, 180)
        else:  # 30% older transactions
            days_back = random.randint(180, 365)
        
        return start_date + timedelta(days=365-days_back)
    
    def _select_product_for_retailer(self, retailer, month, seasonal_patterns):
        """Select appropriate product based on retailer characteristics"""
        # Filter brands based on retailer segment
        suitable_brands = []
        
        for brand_name, brand_info in self.product_catalog.items():
            if self._is_brand_suitable_for_retailer(retailer, brand_info):
                suitable_brands.append(brand_name)
        
        if not suitable_brands:
            suitable_brands = list(self.product_catalog.keys())
        
        brand_name = random.choice(suitable_brands)
        
        # Select product from brand based on popularity and seasonality
        brand_products = self.product_catalog[brand_name]["products"]
        
        # Weight by popularity and seasonal factors
        weights = []
        for product in brand_products:
            base_weight = product["popularity"]
            seasonal_weight = seasonal_patterns.get(product["name"], {}).get(month, 1.0)
            final_weight = base_weight * seasonal_weight
            weights.append(final_weight)
        
        selected_product = random.choices(brand_products, weights=weights, k=1)[0]
        return brand_name, selected_product
    
    def _is_brand_suitable_for_retailer(self, retailer, brand_info):
        """Check if brand matches retailer characteristics"""
        # Premium retailers more likely to carry premium brands
        if retailer["customer_segment"] == "Premium":
            return True  # Premium retailers carry all brands
        elif retailer["customer_segment"] == "Budget":
            # Budget retailers prefer high-volume, lower-margin products
            return brand_info.get("market_share", 0) > 20
        else:  # Mid-range
            return True  # Mid-range retailers carry most brands
    
    def _calculate_base_quantity(self, retailer, product):
        """Calculate base order quantity based on retailer size and product characteristics"""
        size_multipliers = {
            "Small": random.randint(5, 25),
            "Medium": random.randint(25, 100),
            "Large": random.randint(100, 500)
        }
        
        base_qty = size_multipliers[retailer["size"]]
        
        # Adjust for product price (expensive items ordered in smaller quantities)
        if product["price"] > 200:
            base_qty = max(1, base_qty // 3)
        elif product["price"] > 100:
            base_qty = max(1, base_qty // 2)
        elif product["price"] < 30:
            base_qty = base_qty * 2
        
        return base_qty
    
    def _select_payment_terms(self, retailer, total_amount):
        """Select payment terms based on retailer characteristics and order value"""
        if retailer["size"] == "Large" and total_amount > 10000:
            return random.choices(
                self.payment_terms,
                weights=[10, 30, 40, 20],  # Prefer longer credit terms
                k=1
            )[0]
        elif retailer["size"] == "Medium" and total_amount > 5000:
            return random.choices(
                self.payment_terms,
                weights=[20, 40, 30, 10],
                k=1
            )[0]
        else:
            return random.choices(
                self.payment_terms,
                weights=[60, 30, 10, 0],  # Mostly cash for small orders
                k=1
            )[0]
    
    def _generate_basket_purchases(self, retailer, anchor_product, transaction_date, basket_patterns):
        """Generate complementary purchases in the same transaction"""
        complementary_transactions = []
        
        if anchor_product in basket_patterns:
            for complement in basket_patterns[anchor_product]:
                if random.random() < complement["probability"]:
                    # Find the complement product in catalog
                    complement_brand, complement_product = self._find_product_by_name(complement["product"])
                    
                    if complement_brand and complement_product:
                        quantity = max(1, self._calculate_base_quantity(retailer, complement_product) // 3)
                        
                        transaction = {
                            "transaction_id": str(uuid.uuid4()),
                            "retailer_id": retailer["id"],
                            "retailer_name": retailer["name"],
                            "retailer_size": retailer["size"],
                            "retailer_location": retailer["location"],
                            "retailer_segment": retailer["customer_segment"],
                            "product_name": complement_product["name"],
                            "brand": complement_brand,
                            "category": self.product_catalog[complement_brand]["category"],
                            "sub_category": self.product_catalog[complement_brand]["sub_category"],
                            "supplier": self.product_catalog[complement_brand]["company"],
                            "unit_price": complement_product["price"],
                            "quantity": quantity,
                            "total_amount": complement_product["price"] * quantity,
                            "margin_percent": complement_product["margin"],
                            "purchase_date": transaction_date.isoformat(),
                            "payment_terms": self._select_payment_terms(retailer, complement_product["price"] * quantity),
                            "popularity_score": complement_product["popularity"],
                            "seasonal_factor": 1.0,
                            "is_basket_item": True,
                            "anchor_product": anchor_product
                        }
                        complementary_transactions.append(transaction)
        
        return complementary_transactions
    
    def _find_product_by_name(self, product_name):
        """Find product and brand by product name"""
        for brand_name, brand_info in self.product_catalog.items():
            for product in brand_info["products"]:
                if product["name"] == product_name:
                    return brand_name, product
        return None, None
    
    def generate_complete_dataset(self):
        """Generate complete mock dataset with all entities and relationships"""
        print("Generating retailer profiles...")
        retailers = self.generate_retailer_profiles(50)
        
        print("Generating purchase transactions...")
        transactions = self.generate_purchase_transactions(retailers, 2000)
        
        print("Generating competitive analysis data...")
        competitive_data = self._generate_competitive_relationships()
        
        print("Generating supplier performance data...")
        supplier_data = self._generate_supplier_data()
        
        dataset = {
            "retailers": retailers,
            "transactions": transactions,
            "product_catalog": self.product_catalog,
            "competitive_relationships": competitive_data,
            "supplier_performance": supplier_data,
            "generation_timestamp": datetime.now().isoformat(),
            "total_retailers": len(retailers),
            "total_transactions": len(transactions)
        }
        
        return dataset
    
    def _generate_competitive_relationships(self):
        """Generate competitive relationships between products"""
        competitive_pairs = [
            ("Taj Mahal Tea Strong", "Brooke Bond Red Label Tea"),
            ("Maggi 2-Minute Masala Noodles", "Yippee Noodles"),
            ("Good Day Biscuits", "Parle-G"),
            ("Colgate Strong Teeth", "Pepsodent"),
            ("Dettol Antiseptic Liquid", "Savlon")
        ]
        
        return [
            {
                "product1": pair[0],
                "product2": pair[1],
                "competition_intensity": random.uniform(0.6, 0.9),
                "market_overlap": random.uniform(0.7, 0.95),
                "price_similarity": random.uniform(0.8, 0.98)
            }
            for pair in competitive_pairs
        ]
    
    def _generate_supplier_data(self):
        """Generate supplier performance metrics"""
        suppliers = {}
        
        for brand_name, brand_info in self.product_catalog.items():
            company = brand_info["company"]
            if company not in suppliers:
                suppliers[company] = {
                    "company_name": company,
                    "reliability_score": random.uniform(0.8, 0.98),
                    "on_time_delivery": random.uniform(0.85, 0.95),
                    "quality_rating": random.uniform(4.2, 4.8),
                    "payment_flexibility": random.choice(["High", "Medium", "Low"]),
                    "geographical_coverage": random.choice(["National", "Regional", "Metro"]),
                    "brands_supplied": []
                }
            suppliers[company]["brands_supplied"].append(brand_name)
        
        return list(suppliers.values())

if __name__ == "__main__":
    generator = QwipoMockDataGenerator()
    dataset = generator.generate_complete_dataset()
    
    with open("../mock_data/qwipo_complete_dataset.json", "w") as f:
        json.dump(dataset, f, indent=2, default=str)
    
    print(f"\nDataset generated successfully!")
    print(f"Total Retailers: {len(dataset['retailers'])}")
    print(f"Total Transactions: {len(dataset['transactions'])}")
    print(f"Total Products: {sum(len(brand['products']) for brand in dataset['product_catalog'].values())}")
    print(f"Total Brands: {len(dataset['product_catalog'])}")