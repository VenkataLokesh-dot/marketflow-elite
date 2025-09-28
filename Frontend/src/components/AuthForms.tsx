import { useState } from "react";
import { Eye, EyeOff, User, ShoppingBag, Store, Mail, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const businessCategories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
  "Automotive",
  "Handmade & Crafts",
];

const AuthForms = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [buyerSignupData, setBuyerSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [sellerSignupData, setSellerSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessCategory: "",
    businessDescription: "",
    agreeTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Login Successful!",
      description: "Welcome back to MarketHub Pro",
    });
    
    setIsLoading(false);
  };

  const handleBuyerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerSignupData.password !== buyerSignupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Account Created!",
      description: "Welcome to MarketHub Pro. Your buyer account is ready!",
    });
    
    setIsLoading(false);
  };

  const handleSellerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sellerSignupData.password !== sellerSignupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Seller Account Created!",
      description: "Your seller dashboard is being prepared. Welcome to MarketHub Pro!",
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Join{" "}
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              MarketHub Pro
            </span>
          </h1>
          <p className="text-muted-foreground">
            Your gateway to the ultimate marketplace experience
          </p>
        </div>

        <Card className="bg-gradient-card border-0 shadow-premium animate-scale-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="login" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Login</span>
              </TabsTrigger>
              <TabsTrigger value="buyer" className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Join as Buyer</span>
              </TabsTrigger>
              <TabsTrigger value="seller" className="flex items-center space-x-2">
                <Store className="h-4 w-4" />
                <span>Become Seller</span>
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Sign in to your MarketHub Pro account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 focus-ring"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pr-10 focus-ring"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginData.remember}
                        onCheckedChange={(checked) => setLoginData(prev => ({ ...prev, remember: !!checked }))}
                      />
                      <Label htmlFor="remember" className="text-sm">Remember me</Label>
                    </div>
                    <Button variant="link" className="text-primary p-0 h-auto">
                      Forgot Password?
                    </Button>
                  </div>

                  <Button type="submit" className="btn-hero w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Buyer Signup Form */}
            <TabsContent value="buyer">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Join as Smart Buyer</CardTitle>
                <CardDescription className="text-center">
                  Discover amazing deals from verified sellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBuyerSignup} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="buyer-name"
                          placeholder="Enter your full name"
                          className="pl-10 focus-ring"
                          value={buyerSignupData.fullName}
                          onChange={(e) => setBuyerSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="buyer-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="buyer-phone"
                          type="tel"
                          placeholder="Enter your phone"
                          className="pl-10 focus-ring"
                          value={buyerSignupData.phone}
                          onChange={(e) => setBuyerSignupData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyer-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="buyer-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 focus-ring"
                        value={buyerSignupData.email}
                        onChange={(e) => setBuyerSignupData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-password">Password</Label>
                      <Input
                        id="buyer-password"
                        type="password"
                        placeholder="Create password"
                        className="focus-ring"
                        value={buyerSignupData.password}
                        onChange={(e) => setBuyerSignupData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="buyer-confirm">Confirm Password</Label>
                      <Input
                        id="buyer-confirm"
                        type="password"
                        placeholder="Confirm password"
                        className="focus-ring"
                        value={buyerSignupData.confirmPassword}
                        onChange={(e) => setBuyerSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="buyer-terms"
                      checked={buyerSignupData.agreeTerms}
                      onCheckedChange={(checked) => setBuyerSignupData(prev => ({ ...prev, agreeTerms: !!checked }))}
                      required
                    />
                    <Label htmlFor="buyer-terms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="text-primary p-0 h-auto text-sm">
                        Terms & Conditions
                      </Button>
                      {" "}and{" "}
                      <Button variant="link" className="text-primary p-0 h-auto text-sm">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <Button type="submit" className="btn-hero w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Buyer Account"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Seller Signup Form */}
            <TabsContent value="seller">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Become a Pro Seller</CardTitle>
                <CardDescription className="text-center">
                  Start selling to millions of customers worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSellerSignup} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="seller-name"
                          placeholder="Enter your full name"
                          className="pl-10 focus-ring"
                          value={sellerSignupData.fullName}
                          onChange={(e) => setSellerSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seller-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="seller-phone"
                          type="tel"
                          placeholder="Enter your phone"
                          className="pl-10 focus-ring"
                          value={sellerSignupData.phone}
                          onChange={(e) => setSellerSignupData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seller-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="seller-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 focus-ring"
                        value={sellerSignupData.email}
                        onChange={(e) => setSellerSignupData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller-business">Business Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="seller-business"
                          placeholder="Enter business name"
                          className="pl-10 focus-ring"
                          value={sellerSignupData.businessName}
                          onChange={(e) => setSellerSignupData(prev => ({ ...prev, businessName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seller-category">Business Category</Label>
                      <Select 
                        value={sellerSignupData.businessCategory} 
                        onValueChange={(value) => setSellerSignupData(prev => ({ ...prev, businessCategory: value }))}
                      >
                        <SelectTrigger className="focus-ring">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessCategories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seller-description">Business Description</Label>
                    <Textarea
                      id="seller-description"
                      placeholder="Tell us about your business..."
                      className="focus-ring min-h-20"
                      value={sellerSignupData.businessDescription}
                      onChange={(e) => setSellerSignupData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller-password">Password</Label>
                      <Input
                        id="seller-password"
                        type="password"
                        placeholder="Create password"
                        className="focus-ring"
                        value={sellerSignupData.password}
                        onChange={(e) => setSellerSignupData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seller-confirm">Confirm Password</Label>
                      <Input
                        id="seller-confirm"
                        type="password"
                        placeholder="Confirm password"
                        className="focus-ring"
                        value={sellerSignupData.confirmPassword}
                        onChange={(e) => setSellerSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seller-terms"
                      checked={sellerSignupData.agreeTerms}
                      onCheckedChange={(checked) => setSellerSignupData(prev => ({ ...prev, agreeTerms: !!checked }))}
                      required
                    />
                    <Label htmlFor="seller-terms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="text-primary p-0 h-auto text-sm">
                        Seller Agreement
                      </Button>
                      {" "}and{" "}
                      <Button variant="link" className="text-primary p-0 h-auto text-sm">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <Button type="submit" className="btn-hero w-full" disabled={isLoading}>
                    {isLoading ? "Creating Seller Account..." : "Start Selling Today"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthForms;