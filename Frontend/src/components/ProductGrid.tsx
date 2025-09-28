import { useState } from "react";
import { Heart, ShoppingCart, Star, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock product data
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg",
    seller: "AudioTech Pro",
    rating: 4.8,
    reviews: 1234,
    isFlashDeal: true,
    isTrending: true,
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
    isFlashDeal: false,
    isTrending: true,
    discount: 25,
  },
  {
    id: 3,
    name: "Professional Camera Lens",
    price: 649.99,
    originalPrice: null,
    image: "/placeholder.svg",
    seller: "PhotoPro",
    rating: 4.9,
    reviews: 432,
    isFlashDeal: false,
    isTrending: false,
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
    isFlashDeal: true,
    isTrending: false,
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
    isFlashDeal: false,
    isTrending: true,
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
    isFlashDeal: true,
    isTrending: false,
    discount: 22,
  },
];

const ProductGrid = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const flashDeals = products.filter(p => p.isFlashDeal);
  const trendingProducts = products.filter(p => p.isTrending);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Flash Deals Section */}
      {flashDeals.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Zap className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Flash Deals</h2>
                <p className="text-muted-foreground">Limited time offers ending soon</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Ends in</p>
              <p className="text-lg font-bold text-destructive">23:59:42</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {flashDeals.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                onNavigate={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Now Section */}
      {trendingProducts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground">Most popular products this week</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                onNavigate={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">All Products</h2>
          <Button variant="outline">View All Categories</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              onNavigate={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

interface ProductCardProps {
  product: typeof products[0];
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onNavigate: () => void;
}

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onNavigate }: ProductCardProps) => {
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
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFlashDeal && (
              <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-1">
                Flash Deal
              </Badge>
            )}
            {product.isTrending && (
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1">
                Trending
              </Badge>
            )}
            {product.discount > 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                -{product.discount}%
              </Badge>
            )}
          </div>

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

          {/* Quick Add Button - Appears on Hover */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              className="w-full btn-hero text-sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle quick add functionality here if needed
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
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

export default ProductGrid;