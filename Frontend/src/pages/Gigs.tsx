
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gigs, categories } from "@/data/mock";
import GigCard from "@/components/gigs/GigCard";
import { SearchIcon, FilterIcon } from "lucide-react";

const filterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export default function Gigs() {
  const [filteredGigs, setFilteredGigs] = useState(gigs);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      category: "all",
      minPrice: 0,
      maxPrice: 1000,
      sort: "newest",
    },
  });

  function onSubmit(data: FilterValues) {
    let filtered = [...gigs];
    
    // Filter by search term
    if (data.search) {
      filtered = filtered.filter(gig => 
        gig.title.toLowerCase().includes(data.search!.toLowerCase())
      );
    }
    
    // Filter by category
    if (data.category && data.category !== "all") {
      filtered = filtered.filter(gig => gig.category === data.category);
    }
    
    // Filter by price range
    filtered = filtered.filter(gig => 
      gig.price >= priceRange[0] && gig.price <= priceRange[1]
    );
    
    // Sort results
    if (data.sort) {
      filtered = sortGigs(filtered, data.sort);
    }
    
    setFilteredGigs(filtered);
  }

  function sortGigs(gigsToSort: typeof gigs, sortBy: string) {
    switch (sortBy) {
      case "newest":
        return [...gigsToSort].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price_asc":
        return [...gigsToSort].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...gigsToSort].sort((a, b) => b.price - a.price);
      case "rating":
        return [...gigsToSort].sort((a, b) => b.rating - a.rating);
      default:
        return gigsToSort;
    }
  }

  function handlePriceRangeChange(value: number[]) {
    setPriceRange([value[0], value[1]]);
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Explore Gigs</h1>
            <p className="text-gray-600 mt-1">Find the perfect service for your business needs</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={16} />
            Filters
          </Button>
        </div>

        <div className="mb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            placeholder="Search for gigs..."
                            className="pl-10 pr-4"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="flex-shrink-0">
                  Search
                </Button>
              </div>

              {showFilters && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "all"}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</p>
                        <Slider
                          defaultValue={priceRange}
                          min={0}
                          max={1000}
                          step={10}
                          onValueChange={handlePriceRangeChange}
                          className="my-4"
                        />
                      </div>

                      <div>
                        <FormField
                          control={form.control}
                          name="sort"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sort By" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900">No gigs found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
