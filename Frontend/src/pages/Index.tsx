import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar with Filters */}
          <aside className="flex-shrink-0">
            <FilterSidebar />
          </aside>
          
          {/* Main Product Area */}
          <main className="flex-1">
            <ProductGrid />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
