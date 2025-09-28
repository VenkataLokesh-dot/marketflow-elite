import { useState } from "react";
import { Package, ShoppingCart, Plus, Minus, Download, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

interface BulkProduct {
  id: number;
  name: string;
  seller: string;
  unitPrice: number;
  stock: number;
  minOrderQty: number;
  category: string;
  image: string;
  quantity: number;
  selected: boolean;
}

const bulkProducts: BulkProduct[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    seller: "AudioTech Pro",
    unitPrice: 299.99,
    stock: 500,
    minOrderQty: 10,
    category: "Electronics",
    image: "/placeholder.svg",
    quantity: 0,
    selected: false,
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    seller: "FitGear",
    unitPrice: 149.99,
    stock: 1000,
    minOrderQty: 20,
    category: "Electronics",
    image: "/placeholder.svg",
    quantity: 0,
    selected: false,
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    seller: "ComfortZone",
    unitPrice: 299.99,
    stock: 200,
    minOrderQty: 5,
    category: "Furniture",
    image: "/placeholder.svg",
    quantity: 0,
    selected: false,
  },
  {
    id: 4,
    name: "Gaming Mechanical Keyboard",
    seller: "GameGear",
    unitPrice: 179.99,
    stock: 300,
    minOrderQty: 15,
    category: "Electronics",
    image: "/placeholder.svg",
    quantity: 0,
    selected: false,
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    seller: "SoundWave",
    unitPrice: 199.99,
    stock: 400,
    minOrderQty: 12,
    category: "Electronics",
    image: "/placeholder.svg",
    quantity: 0,
    selected: false,
  },
];

const BulkOrder = () => {
  const [products, setProducts] = useState<BulkProduct[]>(bulkProducts);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sellerFilter, setSellerFilter] = useState("All");
  const { toast } = useToast();

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const sellers = ["All", ...Array.from(new Set(products.map(p => p.seller)))];

  const filteredProducts = products.filter(product => 
    (categoryFilter === "All" || product.category === categoryFilter) &&
    (sellerFilter === "All" || product.seller === sellerFilter)
  );

  const selectedProducts = products.filter(p => p.selected && p.quantity > 0);
  const totalItems = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = selectedProducts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);

  // Bulk discount tiers
  const getBulkDiscount = (total: number) => {
    if (total >= 50000) return 0.15; // 15% off for $50k+
    if (total >= 20000) return 0.12; // 12% off for $20k+
    if (total >= 10000) return 0.10; // 10% off for $10k+
    if (total >= 5000) return 0.07;  // 7% off for $5k+
    if (total >= 2000) return 0.05;  // 5% off for $2k+
    return 0;
  };

  const bulkDiscount = getBulkDiscount(subtotal);
  const discountAmount = subtotal * bulkDiscount;
  const finalTotal = subtotal - discountAmount;

  const updateQuantity = (id: number, quantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: Math.max(0, quantity) } : p
    ));
  };

  const toggleSelection = (id: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectAll = () => {
    const allSelected = filteredProducts.every(p => p.selected);
    setProducts(prev => prev.map(p => {
      if (filteredProducts.find(fp => fp.id === p.id)) {
        return { ...p, selected: !allSelected };
      }
      return p;
    }));
  };

  const clearOrder = () => {
    setProducts(prev => prev.map(p => ({ ...p, quantity: 0, selected: false })));
    toast({
      title: "Order cleared",
      description: "All items have been removed from your bulk order.",
    });
  };

  const saveOrderTemplate = () => {
    toast({
      title: "Order template saved",
      description: "Your bulk order template has been saved for future use.",
    });
  };

  const exportOrder = () => {
    toast({
      title: "Order exported",
      description: "Your bulk order summary has been exported as PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Bulk Orders</h1>
              <p className="text-muted-foreground">
                Order in bulk and save with our special pricing tiers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={saveOrderTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
            <Button variant="outline" onClick={exportOrder}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            {selectedProducts.length > 0 && (
              <Button variant="outline" onClick={clearOrder}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Order
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <Card className="bg-gradient-card border-0 shadow-lg mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Category:</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
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

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Seller:</label>
                    <Select value={sellerFilter} onValueChange={setSellerFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sellers.map(seller => (
                          <SelectItem key={seller} value={seller}>
                            {seller}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" onClick={selectAll}>
                    {filteredProducts.every(p => p.selected) ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Min Qty</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={product.selected}
                            onCheckedChange={() => toggleSelection(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.seller}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${product.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 100 ? "default" : "destructive"}>
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.minOrderQty}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(product.id, product.quantity - 1)}
                              disabled={product.quantity <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                              className="w-16 h-6 text-center text-xs"
                              min="0"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(product.id, product.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          {product.quantity > 0 && product.quantity < product.minOrderQty && (
                            <p className="text-xs text-destructive mt-1">
                              Min: {product.minOrderQty}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="font-bold">
                          ${(product.unitPrice * product.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Bulk Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bulk Discount Tiers */}
                <div className="text-sm">
                  <p className="font-medium mb-2">Bulk Discount Tiers:</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className={subtotal >= 2000 ? "text-primary font-medium" : ""}>
                      $2,000+: 5% off
                    </div>
                    <div className={subtotal >= 5000 ? "text-primary font-medium" : ""}>
                      $5,000+: 7% off
                    </div>
                    <div className={subtotal >= 10000 ? "text-primary font-medium" : ""}>
                      $10,000+: 10% off
                    </div>
                    <div className={subtotal >= 20000 ? "text-primary font-medium" : ""}>
                      $20,000+: 12% off
                    </div>
                    <div className={subtotal >= 50000 ? "text-primary font-medium" : ""}>
                      $50,000+: 15% off
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Selected Items</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {bulkDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary">
                        Bulk Discount ({(bulkDiscount * 100).toFixed(0)}%)
                      </span>
                      <span className="font-medium text-primary">
                        -${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>

                {/* Selected Products Preview */}
                {selectedProducts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Products:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {selectedProducts.map(product => (
                        <div key={product.id} className="text-xs flex justify-between">
                          <span className="truncate">{product.name}</span>
                          <span>{product.quantity}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full btn-hero" 
                  disabled={selectedProducts.length === 0}
                >
                  Place Bulk Order
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  🔒 Secure bulk ordering with NET payment terms available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrder;