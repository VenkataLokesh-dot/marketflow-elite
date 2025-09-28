import { useState } from "react";
import { Search, ShoppingCart, Heart, Bell, User, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-primary-gradient p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              MarketHub Pro
            </span>
          </div>

          {/* Advanced Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center space-x-2">
            <div className="flex-1 relative">
              <div className="flex items-center bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-sm">
                <Select>
                  <SelectTrigger className="w-32 border-none bg-transparent">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home & Living</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="books">Books & Media</SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-px h-6 bg-border" />
                <Input 
                  placeholder="Search products, brands, and more..." 
                  className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button size="sm" className="m-1 bg-primary-gradient hover:shadow-glow">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs flex items-center justify-center text-white">
                  5
                </span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs flex items-center justify-center text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </Button>

          <Button className="btn-hero" asChild>
            <Link to="/auth">Sell Products</Link>
          </Button>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                  <div className="h-8 w-8 bg-primary-gradient rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Orders</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products">Browse Products</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bulk-order">Bulk Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Seller Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="flex items-center bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-sm">
            <Input 
              placeholder="Search products..." 
              className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="sm" className="m-1 bg-primary-gradient">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-card mx-4 mb-4 p-4 animate-slide-up">
          <div className="flex flex-col space-y-3">
            <Button className="btn-hero justify-start" asChild>
              <Link to="/auth">Sell Products</Link>
            </Button>
            <Button variant="ghost" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" className="justify-start">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Button>
            <Button variant="ghost" className="justify-start">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;