import { useState } from "react";
import { Heart, ShoppingCart, Star, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Expanded mock product data
const allProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg",
    seller: "AudioTech Pro",
    rating: 4.8,
    reviews: 1234,
    category: "Electronics",
    brand: "AudioTech",
    discount: 25,
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg",
    seller: "FitGear",
    rating: 4.6,
    reviews: 856,
    category: "Electronics",
    brand: "FitGear",
    discount: 25,
  },
  {
    id: 3,
    name: "Designer Leather Jacket",
    price: 449.99,
    originalPrice: null,
    image: "/placeholder.svg",
    seller: "FashionHub",
    rating: 4.9,
    reviews: 432,
    category: "Fashion",
    brand: "StyleCo",
    discount: 0,
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 299.99,
    originalPrice: 449.99,
    image: "/placeholder.svg",
    seller: "ComfortZone",
    rating: 4.7,
    reviews: 678,
    category: "Home & Living",
    brand: "ComfortZone",
    discount: 33,
  },
  {
    id: 5,
    name: "Smart Home Hub",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg",
    seller: "HomeTech",
    rating: 4.5,
    reviews: 234,
    category: "Electronics",
    brand: "HomeTech",
    discount: 31,
  },
  {
    id: 6,
    name: "Gaming Mechanical Keyboard",
    price: 179.99,
    originalPrice: 229.99,
    image: "/placeholder.svg",
    seller: "GameGear",
    rating: 4.8,
    reviews: 1567,
    category: "Electronics",
    brand: "GameGear",
    discount: 22,
  },
  {
    id: 7,
    name: "Yoga Mat Premium",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg",
    seller: "YogaLife",
    rating: 4.6,
    reviews: 543,
    category: "Sports & Outdoors",
    brand: "YogaLife",
    discount: 20,
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg",
    seller: "SoundWave",
    rating: 4.7,
    reviews: 892,
    category: "Electronics",
    brand: "SoundWave",
    discount: 20,
  },
];

const categories = ["All", "Electronics", "Fashion", "Home & Living", "Sports & Outdoors"];
const brands = ["All", "AudioTech", "FitGear", "StyleCo", "ComfortZone", "HomeTech", "GameGear", "YogaLife", "SoundWave"];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: typeof allProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredProducts = allProducts
    .filter(product => 
      selectedCategory === "All" || product.category === selectedCategory
    )
    .filter(product => 
      selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    )
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .filter(product => 
      product.rating >= minRating
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {allProducts.length} products
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`flex-shrink-0 w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <Separator className="my-4" />

                {/* Brand Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Brands</Label>
                  <div className="space-y-2">
                    {brands.filter(brand => brand !== "All").map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <Label htmlFor={brand} className="text-sm">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Rating Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Minimum Rating: {minRating}+
                  </Label>
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="mt-2"
                  />
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrands([]);
                    setPriceRange([0, 500]);
                    setMinRating(0);
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  onNavigate={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrands([]);
                    setPriceRange([0, 500]);
                    setMinRating(0);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: typeof allProducts[0];
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onNavigate: () => void;
}

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onAddToCart, onNavigate }: ProductCardProps) => {
  return (
    <Card className="bg-gradient-card border-0 shadow-lg card-hover group overflow-hidden cursor-pointer">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden" onClick={onNavigate}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1">
              -{product.discount}%
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              }`} 
            />
          </Button>

          {/* Quick Add Button */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              className="w-full btn-hero text-sm" 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4" onClick={onNavigate}>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2">{product.seller}</p>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
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
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-foreground">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Products;