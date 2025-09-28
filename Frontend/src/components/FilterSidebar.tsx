import { useState } from "react";
import { ChevronDown, ChevronUp, X, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const categories = [
  { id: "electronics", name: "Electronics", count: 1234 },
  { id: "fashion", name: "Fashion", count: 987 },
  { id: "home", name: "Home & Living", count: 756 },
  { id: "sports", name: "Sports & Outdoors", count: 543 },
  { id: "books", name: "Books & Media", count: 432 },
  { id: "beauty", name: "Health & Beauty", count: 321 },
  { id: "automotive", name: "Automotive", count: 234 },
  { id: "handmade", name: "Handmade & Crafts", count: 189 },
];

const brands = [
  { id: "apple", name: "Apple", count: 234 },
  { id: "samsung", name: "Samsung", count: 198 },
  { id: "sony", name: "Sony", count: 156 },
  { id: "nike", name: "Nike", count: 143 },
  { id: "adidas", name: "Adidas", count: 132 },
  { id: "lg", name: "LG", count: 98 },
];

const ratings = [
  { stars: 5, count: 567 },
  { stars: 4, count: 432 },
  { stars: 3, count: 234 },
  { stars: 2, count: 123 },
  { stars: 1, count: 45 },
];

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  minRating: number;
  inStock: boolean;
  freeShipping: boolean;
  onSale: boolean;
}

const FilterSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
    features: true,
  });
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    minRating: 0,
    inStock: false,
    freeShipping: false,
    onSale: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'categories' | 'brands', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      minRating: 0,
      inStock: false,
      freeShipping: false,
      onSale: false,
    });
  };

  const getAppliedFiltersCount = () => {
    return (
      filters.categories.length +
      filters.brands.length +
      (filters.minRating > 0 ? 1 : 0) +
      (filters.inStock ? 1 : 0) +
      (filters.freeShipping ? 1 : 0) +
      (filters.onSale ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)
    );
  };

  const appliedFiltersCount = getAppliedFiltersCount();

  const FilterContent = () => (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-primary" />
            <span>Filters</span>
            {appliedFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {appliedFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {appliedFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
        
        {/* Applied Filters Tags */}
        {appliedFiltersCount > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {filters.categories.map(cat => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {categories.find(c => c.id === cat)?.name}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => toggleArrayFilter('categories', cat)}
                />
              </Badge>
            ))}
            {filters.brands.map(brand => (
              <Badge key={brand} variant="secondary" className="text-xs">
                {brands.find(b => b.id === brand)?.name}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => toggleArrayFilter('brands', brand)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="font-semibold">Categories</span>
            {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => toggleArrayFilter('categories', category.id)}
                  />
                  <label 
                    htmlFor={category.id} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">({category.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="font-semibold">Price Range</span>
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brands */}
        <Collapsible open={openSections.brands} onOpenChange={() => toggleSection('brands')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="font-semibold">Brands</span>
            {openSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id}
                    checked={filters.brands.includes(brand.id)}
                    onCheckedChange={() => toggleArrayFilter('brands', brand.id)}
                  />
                  <label 
                    htmlFor={brand.id} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">({brand.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Rating */}
        <Collapsible open={openSections.rating} onOpenChange={() => toggleSection('rating')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="font-semibold">Customer Rating</span>
            {openSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {ratings.map((rating) => (
              <div 
                key={rating.stars} 
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors hover:bg-muted ${
                  filters.minRating >= rating.stars ? 'bg-primary/10' : ''
                }`}
                onClick={() => updateFilter('minRating', rating.stars)}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-xs ${
                          i < rating.stars ? 'text-yellow-400' : 'text-muted-foreground/30'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm">& up</span>
                </div>
                <span className="text-xs text-muted-foreground">({rating.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Additional Features */}
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="font-semibold">Features</span>
            {openSections.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilter('inStock', !!checked)}
              />
              <label htmlFor="inStock" className="text-sm font-medium cursor-pointer">
                In Stock Only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freeShipping"
                checked={filters.freeShipping}
                onCheckedChange={(checked) => updateFilter('freeShipping', !!checked)}
              />
              <label htmlFor="freeShipping" className="text-sm font-medium cursor-pointer">
                Free Shipping
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onSale"
                checked={filters.onSale}
                onCheckedChange={(checked) => updateFilter('onSale', !!checked)}
              />
              <label htmlFor="onSale" className="text-sm font-medium cursor-pointer">
                On Sale
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );

  // Mobile overlay
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-80 bg-background shadow-xl overflow-y-auto">
          <FilterContent />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed bottom-4 right-4 z-40 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Sliders className="h-4 w-4 mr-2" />
        Filters
        {appliedFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {appliedFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 sticky top-20 h-fit">
        <FilterContent />
      </div>
    </>
  );
};

export default FilterSidebar;