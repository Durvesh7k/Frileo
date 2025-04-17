import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ChevronRight, Star, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import CategoryCard from "@/components/categories/CategoryCard";
import GigCard from "@/components/gigs/GigCard";
import { categories } from "@/data/mock";
import axiosInstance from "@/utils/axiosInstance";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gigs, setGigs] = useState([]);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    categories: false,
    gigs: false,
    howItWorks: false,
    cta: false
  });

  // Show only 4 featured categories on the homepage
  const featuredCategories = categories.slice(0, 4);

  const getGigs = async () => {
    try {
      const response = await axiosInstance.get("/gigs");
      setGigs(response.data);
    } catch (err) {
      console.log("Error in fetching gigs", err);
    }
  };

  // Handle intersection observer for animations
  useEffect(() => {
    getGigs();
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observers = [];

    const observerCallback = (entries, sectionName) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [sectionName]: true }));
        }
      });
    };

    const sections = [
      { id: "hero-section", name: "hero" },
      { id: "categories-section", name: "categories" },
      { id: "gigs-section", name: "gigs" },
      { id: "how-it-works-section", name: "howItWorks" },
      { id: "cta-section", name: "cta" }
    ];

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => observerCallback(entries, section.name),
          observerOptions
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    // Cleanup observers
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would navigate to the search results page
    window.location.href = `/gigs?search=${encodeURIComponent(searchQuery)}`;
  };

  const featuredGigs = gigs.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section
        id="hero-section"
        className="bg-gradient-to-r from-brand-darkBlue to-brand-blue text-white relative overflow-hidden"
      >
        {/* Background animated patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-brand-orange/10 blur-3xl animate-pulse"></div>
          <div className="absolute -left-20 top-1/2 w-72 h-72 rounded-full bg-brand-orange/15 blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center relative z-10">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Find the perfect <span className="text-brand-orange">freelancer</span> for your project
          </h1>
          <p className={`text-xl mb-10 max-w-2xl opacity-90 transition-all duration-1000 delay-300 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Connect with talented professionals who can bring your ideas to life, whatever your budget
          </p>

          <form onSubmit={handleSearch} className={`w-full max-w-xl transition-all duration-1000 delay-500 relative z-10 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search for services (e.g. logo design, web development)"
                className="pl-12 py-7 rounded-full border-0 shadow-xl text-gray-900 pr-36 transition-all duration-300 group-hover:shadow-brand-orange/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 bg-brand-orange hover:bg-brand-orange/90 transition-all duration-300"
              >
                <span className="mr-2">Search</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </form>

          <div className={`mt-10 text-sm space-x-4 transition-all duration-1000 delay-700 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span>Popular:</span>
            {['Web Design', 'Logo Design', 'WordPress', 'SEO', 'Copywriting'].map((item, index) => (
              <Link
                key={item}
                to={`/gigs?search=${encodeURIComponent(item)}`}
                className="text-brand-orange hover:underline transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white py-8 shadow-md relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-brand-blue text-2xl font-bold">15k+</span>
              <span className="text-gray-600 text-sm">Active Freelancers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-brand-blue text-2xl font-bold">95%</span>
              <span className="text-gray-600 text-sm">Client Satisfaction</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-brand-blue text-2xl font-bold">20k+</span>
              <span className="text-gray-600 text-sm">Projects Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-brand-blue text-2xl font-bold">24/7</span>
              <span className="text-gray-600 text-sm">Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section id="categories-section" className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className={`flex justify-between items-center mb-12 transition-all duration-700 ${isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold">Browse Categories</h2>
            <Link to="/categories" className="text-brand-blue hover:text-brand-orange flex items-center group transition-all duration-300">
              <span>View all categories</span>
              <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category, index) => (
              <div
                key={category.id}
                className={`transition-all duration-700 delay-${index * 100} ${isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section id="gigs-section" className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className={`flex justify-between items-center mb-12 transition-all duration-700 ${isVisible.gigs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <span className="text-brand-orange font-medium mb-2 inline-block">Top Services</span>
              <h2 className="text-3xl font-bold">Featured Gigs</h2>
            </div>
            <Link to="/gigs" className="text-brand-blue hover:text-brand-orange flex items-center group transition-all duration-300">
              <span>View all gigs</span>
              <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGigs.map((gig, index) => (
              <div
                key={gig.id}
                className={`transition-all duration-700 delay-${index % 3 * 150} ${isVisible.gigs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <GigCard gig={gig} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works-section" className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl"></div>
        <div className="absolute -right-20 top-20 w-80 h-80 rounded-full bg-brand-orange/5 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="text-brand-orange font-medium mb-2 inline-block">Simple Process</span>
            <h2 className="text-3xl font-bold">How FreelanceFlow Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Get your project done in just three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting lines (desktop only) */}
            <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-blue to-brand-orange"></div>

            {/* Steps */}
            <div className={`bg-white p-8 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-500 relative z-10 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-blue transition-colors duration-300">Find the Perfect Service</h3>
              <p className="text-gray-600">Browse through thousands of services from top freelancers worldwide.</p>
            </div>

            <div className={`bg-white p-8 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-500 delay-200 relative z-10 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-brand-orange to-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-orange transition-colors duration-300">Place Your Order</h3>
              <p className="text-gray-600">Choose a gig, pay securely, and discuss your needs with the freelancer.</p>
            </div>

            <div className={`bg-white p-8 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-500 delay-400 relative z-10 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-blue transition-colors duration-300">Get Amazing Results</h3>
              <p className="text-gray-600">Receive your completed work and release payment when you're satisfied.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (New Section) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-brand-orange font-medium mb-2 inline-block">Client Stories</span>
            <h2 className="text-3xl font-bold">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">See what clients have accomplished with FreelanceFlow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">5.0</span>
              </div>
              <p className="text-gray-700 mb-6">"The logo design I received was beyond my expectations. My business has a professional look now thanks to FreelanceFlow!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue font-bold">
                  SK
                </div>
                <div className="ml-3">
                  <div className="font-medium">Sarah K.</div>
                  <div className="text-sm text-gray-500">Small Business Owner</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">5.0</span>
              </div>
              <p className="text-gray-700 mb-6">"I found an amazing web developer who turned my vision into reality. The process was smooth and the results were incredible."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center text-brand-orange font-bold">
                  JT
                </div>
                <div className="ml-3">
                  <div className="font-medium">James T.</div>
                  <div className="text-sm text-gray-500">Startup Founder</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">5.0</span>
              </div>
              <p className="text-gray-700 mb-6">"The content writer I hired delivered exactly what I needed for my blog. Will definitely use FreelanceFlow again!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue font-bold">
                  ML
                </div>
                <div className="ml-3">
                  <div className="font-medium">Maria L.</div>
                  <div className="text-sm text-gray-500">Content Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta-section" className="py-20 bg-gradient-to-r from-brand-darkBlue to-brand-blue text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-10 bottom-10 w-80 h-80 rounded-full bg-white/5 blur-2xl"></div>
          <div className="absolute left-20 top-20 w-64 h-64 rounded-full bg-brand-orange/10 blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`max-w-3xl mx-auto transition-all duration-700 ${isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of clients and freelancers and start growing your business today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:translate-y-1 shadow-lg hover:shadow-xl"
              >
                <Link to="/gigs" className="flex items-center">
                  <span>Find Freelancers</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-darkBlue rounded-full px-8 py-6 text-lg transition-all duration-300 hover:translate-y-1"
              >
                <Link to="/register">Become a Freelancer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}