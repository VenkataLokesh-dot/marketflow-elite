import { ShoppingBag, Store, TrendingUp, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero min-h-screen flex items-center overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/80 to-background/90" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full animate-float blur-sm" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-primary/5 rounded-full animate-float blur-sm" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-primary/15 rounded-full animate-float blur-sm" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-primary/8 rounded-full animate-float blur-sm" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Hero Content */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 animate-scale-in">
            <Zap className="h-4 w-4 mr-2" />
            Trusted by 2M+ users worldwide
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight tracking-tight">
            Welcome to{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
                MarketHub Pro
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary-hover/50 rounded-full" />
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            The ultimate marketplace platform connecting 
            <span className="font-semibold text-foreground"> smart buyers </span>
            with 
            <span className="font-semibold text-foreground"> professional sellers </span>
            worldwide.
          </p>

          {/* Enhanced Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-primary/20 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">2M+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-primary/20 rounded-full">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Verified Sellers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-primary/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Buyer Card */}
          <Card className="bg-gradient-card border-0 shadow-premium card-hover group">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-primary-gradient rounded-2xl flex items-center justify-center mb-4 group-hover:animate-glow">
                  <ShoppingBag className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Join as Smart Buyer</h3>
                <p className="text-muted-foreground">
                  Discover amazing deals from verified sellers worldwide. Enjoy secure transactions and fast delivery.
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Buyer Protection Guarantee</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Lightning Fast Checkout</span>
                </div>
              </div>

              <Button className="btn-hero w-full group-hover:shadow-glow" asChild>
                <Link to="/auth">Start Shopping Now</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Seller Card */}
          <Card className="bg-gradient-card border-0 shadow-premium card-hover group">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-primary-gradient rounded-2xl flex items-center justify-center mb-4 group-hover:animate-glow">
                  <Store className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Sell Like a Pro</h3>
                <p className="text-muted-foreground">
                  Transform your business with our advanced seller tools. Reach millions of customers effortlessly.
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Advanced Analytics Dashboard</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Automated Inventory Management</span>
                </div>
              </div>

              <Button className="btn-hero w-full group-hover:shadow-glow" asChild>
                <Link to="/auth">Start Selling Today</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center animate-slide-up">
          <p className="text-sm text-muted-foreground mb-4">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
              TechCorp
            </div>
            <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
              GlobalMart
            </div>
            <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
              QuickSell
            </div>
            <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
              FastTrade
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;