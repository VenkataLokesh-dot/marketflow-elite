import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Star, ShoppingCart, Minus, Plus, Share2, Shield, Truck, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Extended product data with descriptions and reviews
const productData = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    seller: "AudioTech Pro",
    rating: 4.8,
    reviews: 1234,
    category: "Electronics",
    brand: "AudioTech",
    discount: 25,
    inStock: true,
    stockCount: 15,
    description: "Experience premium audio quality with our flagship wireless headphones. Featuring advanced noise cancellation technology, 30-hour battery life, and crystal-clear sound reproduction. Perfect for music lovers, professionals, and anyone who demands the best in audio technology.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life", 
      "Quick charge (5 min = 3 hours)",
      "Bluetooth 5.2 connectivity",
      "Premium leather cushioning",
      "Foldable design"
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Impedance": "32 ohms",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      "Weight": "280g"
    },
    customerReviews: [
      {
        id: 1,
        name: "Sarah Johnson", 
        rating: 5,
        date: "2024-09-15",
        comment: "Absolutely amazing sound quality! The noise cancellation works perfectly for my daily commute.",
        verified: true
      },
      {
        id: 2,
        name: "Mike Chen",
        rating: 4,
        date: "2024-09-10", 
        comment: "Great headphones, very comfortable for long listening sessions. Battery life is excellent.",
        verified: true
      },
      {
        id: 3,
        name: "Emily Davis",
        rating: 5,
        date: "2024-09-08",
        comment: "Best purchase I've made this year. The build quality is outstanding and they look premium.",
        verified: false
      }
    ]
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: 149.99,
    originalPrice: 199.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    seller: "FitGear",
    rating: 4.6,
    reviews: 856,
    category: "Electronics",
    brand: "FitGear",
    discount: 25,
    inStock: true,
    stockCount: 28,
    description: "Track your fitness journey with our advanced smart fitness tracker. Monitor heart rate, sleep patterns, steps, and calories burned. Water-resistant design with 7-day battery life makes it perfect for active lifestyles.",
    features: [
      "Heart rate monitoring",
      "Sleep tracking",
      "7-day battery life",
      "Water resistant (5ATM)",
      "GPS tracking",
      "Multiple sport modes"
    ],
    specifications: {
      "Display": "1.4\" AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      "Sensors": "Heart rate, GPS, Accelerometer",
      "Compatibility": "iOS & Android",
      "Weight": "45g"
    },
    customerReviews: [
      {
        id: 1,
        name: "Alex Thompson",
        rating: 5,
        date: "2024-09-12",
        comment: "Perfect for tracking my runs and workouts. The GPS is very accurate.",
        verified: true
      },
      {
        id: 2,
        name: "Lisa Wang",
        rating: 4,
        date: "2024-09-05",
        comment: "Good value for money. Sleep tracking is quite detailed and helpful.",
        verified: true
      }
    ]
  },
  {
    id: 3,
    name: "Professional Camera Lens",
    price: 649.99,
    originalPrice: null,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    seller: "PhotoPro",
    rating: 4.9,
    reviews: 432,
    category: "Electronics",
    brand: "PhotoPro",
    discount: 0,
    inStock: true,
    stockCount: 8,
    description: "Professional-grade camera lens designed for serious photographers. Features ultra-sharp optics, fast autofocus, and weather-sealed construction. Perfect for portrait, landscape, and commercial photography.",
    features: [
      "Ultra-sharp optics",
      "Fast f/1.4 aperture",
      "Weather-sealed construction",
      "Silent autofocus motor",
      "Image stabilization",
      "Professional build quality"
    ],
    specifications: {
      "Focal Length": "85mm",
      "Maximum Aperture": "f/1.4",
      "Minimum Focus": "0.8m",
      "Filter Thread": "77mm",
      "Weight": "950g",
      "Mount": "Canon EF"
    },
    customerReviews: [
      {
        id: 1,
        name: "David Rodriguez",
        rating: 5,
        date: "2024-09-20",
        comment: "Outstanding lens for portraits. The bokeh is beautiful and the sharpness is incredible.",
        verified: true
      }
    ]
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 299.99,
    originalPrice: 449.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    seller: "ComfortZone",
    rating: 4.7,
    reviews: 678,
    category: "Home & Living",
    brand: "ComfortZone",
    discount: 33,
    inStock: true,
    stockCount: 12,
    description: "Transform your workspace with our ergonomic office chair. Designed for all-day comfort with lumbar support, adjustable height, and breathable mesh back. Perfect for professionals who spend long hours at their desk.",
    features: [
      "Ergonomic lumbar support",
      "Adjustable height",
      "Breathable mesh back",
      "360° swivel",
      "Smooth-rolling casters",
      "Weight capacity: 300lbs"
    ],
    specifications: {
      "Seat Height": "17-21 inches",
      "Seat Width": "20 inches",
      "Back Height": "26 inches",
      "Weight Capacity": "300 lbs",
      "Material": "Mesh and fabric",
      "Warranty": "5 years"
    },
    customerReviews: [
      {
        id: 1,
        name: "Jennifer Lee",
        rating: 5,
        date: "2024-09-18",
        comment: "Best chair I've ever owned. My back pain is completely gone after switching to this chair.",
        verified: true
      },
      {
        id: 2,
        name: "Robert Kim",
        rating: 4,
        date: "2024-09-14",
        comment: "Very comfortable and well-built. Assembly was straightforward.",
        verified: true
      }
    ]
  },
  {
    id: 5,
    name: "Smart Home Hub",
    price: 89.99,
    originalPrice: 129.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    seller: "HomeTech",
    rating: 4.5,
    reviews: 234,
    category: "Electronics",
    brand: "HomeTech",
    discount: 31,
    inStock: true,
    stockCount: 25,
    description: "Control your entire smart home with our advanced smart hub. Compatible with over 1000 devices, voice control support, and easy setup. Make your home smarter and more efficient.",
    features: [
      "Compatible with 1000+ devices",
      "Voice control (Alexa, Google)",
      "Easy smartphone app",
      "Local processing",
      "Automatic updates",
      "Energy monitoring"
    ],
    specifications: {
      "Connectivity": "WiFi, Bluetooth, Zigbee",
      "Processor": "Quad-core ARM",
      "Memory": "1GB RAM, 8GB Storage", 
      "Dimensions": "4.7 x 4.7 x 1.2 inches",
      "Power": "12V DC adapter",
      "Range": "100ft"
    },
    customerReviews: [
      {
        id: 1,
        name: "Tom Wilson",
        rating: 4,
        date: "2024-09-16",
        comment: "Great hub for the price. Setup was easy and it works with all my devices.",
        verified: true
      }
    ]
  },
  {
    id: 6,
    name: "Gaming Mechanical Keyboard",
    price: 179.99,
    originalPrice: 229.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    seller: "GameGear",
    rating: 4.8,
    reviews: 1567,
    category: "Electronics",
    brand: "GameGear",
    discount: 22,
    inStock: true,
    stockCount: 18,
    description: "Elevate your gaming experience with our premium mechanical keyboard. Features custom mechanical switches, RGB backlighting, and aluminum construction. Perfect for gaming and professional typing.",
    features: [
      "Custom mechanical switches",
      "RGB backlighting",
      "Aluminum construction",
      "Anti-ghosting technology",
      "Programmable keys",
      "Detachable USB-C cable"
    ],
    specifications: {
      "Switch Type": "Mechanical (Blue/Red/Brown)",
      "Key Layout": "Full-size (104 keys)",
      "Backlighting": "RGB",
      "Connection": "USB-C",
      "Dimensions": "17.3 x 5.1 x 1.4 inches",
      "Weight": "2.2 lbs"
    },
    customerReviews: [
      {
        id: 1,
        name: "Gaming Pro",
        rating: 5,
        date: "2024-09-22",
        comment: "Amazing keyboard! The switches feel perfect and the RGB looks incredible.",
        verified: true
      },
      {
        id: 2,
        name: "Office Worker",
        rating: 5,
        date: "2024-09-19",
        comment: "Great for both gaming and work. The build quality is outstanding.",
        verified: true
      }
    ]
  }
];

// Function to get recommended products (simple logic based on same category)
const getRecommendedProducts = (currentProduct: typeof productData[0]) => {
  return productData
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4);
};

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = productData.find(p => p.id === parseInt(id || ""));

  useEffect(() => {
    if (!product) {
      navigate("/products");
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const recommendedProducts = getRecommendedProducts(product);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        seller: product.seller,
      });
    }
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`${starSize} ${
              i < Math.floor(rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground/30'
            }`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">by {product.seller}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {renderStars(product.rating, "md")}
                <span className="text-lg font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-foreground">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge className="bg-destructive text-destructive-foreground">
                    -{product.discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                className="flex-1 btn-hero" 
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" onClick={toggleWishlist}>
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
              <Button variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-sm">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
                
                <h4 className="text-lg font-semibold mb-3">Key Features</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-muted/20">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    {renderStars(product.rating, "md")}
                    <span className="text-lg font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {product.customerReviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-muted/20 last:border-0">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{review.name}</h4>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recommended Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((recommendedProduct) => (
                <RecommendedProductCard key={recommendedProduct.id} product={recommendedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

interface RecommendedProductCardProps {
  product: typeof productData[0];
}

const RecommendedProductCard = ({ product }: RecommendedProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="bg-gradient-card border-0 shadow-lg card-hover group overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1">
              -{product.discount}%
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-muted-foreground/30'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Product;