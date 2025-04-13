
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import CategoryCard from "@/components/categories/CategoryCard";
import GigCard from "@/components/gigs/GigCard";
import { categories, gigs } from "@/data/mock";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Show only 4 featured categories on the homepage
  const featuredCategories = categories.slice(0, 4);
  
  // Show only 6 featured gigs on the homepage
  const featuredGigs = gigs.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to the search results page
    window.location.href = `/gigs?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-darkBlue to-brand-blue text-white">
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Find the perfect <span className="text-brand-orange">freelancer</span> for your project
          </h1>
          <p className="text-xl mb-8 max-w-2xl opacity-90 animate-fade-in">
            Connect with talented professionals who can bring your ideas to life, whatever your budget
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-lg animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for services (e.g. logo design, web development)"
                className="pl-10 py-6 rounded-full border-0 shadow-lg text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 rounded-full"
              >
                Search
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-sm space-x-4 animate-fade-in">
            <span>Popular:</span>
            {['Web Design', 'Logo Design', 'WordPress', 'SEO', 'Copywriting'].map((item) => (
              <Link 
                key={item} 
                to={`/gigs?search=${encodeURIComponent(item)}`} 
                className="text-brand-orange hover:underline"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Browse Categories</h2>
            <Link to="/categories" className="text-brand-blue hover:text-brand-orange flex items-center">
              View all categories <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Gigs</h2>
            <Link to="/gigs" className="text-brand-blue hover:text-brand-orange flex items-center">
              View all gigs <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How FreelanceFlow Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover-scale">
              <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find the Perfect Service</h3>
              <p className="text-gray-600">Browse through thousands of services from top freelancers worldwide.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover-scale">
              <div className="w-16 h-16 bg-brand-orange text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Place Your Order</h3>
              <p className="text-gray-600">Choose a gig, pay securely, and discuss your needs with the freelancer.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover-scale">
              <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Amazing Results</h3>
              <p className="text-gray-600">Receive your completed work and release payment when you're satisfied.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-brand-darkBlue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of clients and freelancers and start growing your business today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="default" className="bg-brand-orange hover:bg-brand-orange/90">
              <Link to="/gigs">Find Freelancers</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-darkBlue">
              <Link to="/register">Become a Freelancer</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
