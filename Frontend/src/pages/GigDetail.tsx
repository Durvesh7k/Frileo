
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import RatingStars from "@/components/ui/RatingStars";
import { gigs } from "@/data/mock";
import { Gig } from "@/types";

export default function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");

  // Find the gig with the matching ID
  const gig = gigs.find((g) => g.id === id) || null;

  if (!gig) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Gig not found</h1>
          <p className="mb-6">The gig you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/gigs">Browse Gigs</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleOrderNow = () => {
    toast({
      title: "Order placed",
      description: "Your order has been placed successfully!",
    });
    // In a real app, this would redirect to checkout or create an order
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
            
            <div className="flex items-center mb-6">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={gig.sellerAvatar || "/placeholder.svg"} />
                <AvatarFallback>{gig.sellerName?.[0] || "S"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{gig.sellerName}</p>
                <div className="flex items-center">
                  <RatingStars rating={gig.rating || 0} />
                  <span className="text-sm text-gray-500 ml-1">({gig.reviewCount || 0})</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={gig.image || "/placeholder.svg"} 
                alt={gig.title} 
                className="w-full h-[400px] object-cover"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">About This Gig</h2>
              <p className="text-gray-700">{gig.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gig.includes && gig.includes.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-2 mt-1 text-green-500">✓</div>
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="faq-1">
                <AccordionTrigger>How long does it take to complete an order?</AccordionTrigger>
                <AccordionContent>
                  Delivery time depends on the package you select. Basic packages are typically delivered within {gig.deliveryTime || "3-5"} days.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Do you offer revisions?</AccordionTrigger>
                <AccordionContent>
                  Yes, the number of revisions depends on the package. Basic packages include {gig.revisions || "1-2"} revisions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>What if I'm not satisfied with the work?</AccordionTrigger>
                <AccordionContent>
                  If you're not satisfied, you can request revisions based on your package. If issues persist, our customer support team can help resolve any concerns.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <Card key={review}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center mb-1">
                            <p className="font-medium mr-2">User{review}</p>
                            <RatingStars rating={5} />
                          </div>
                          <p className="text-sm text-gray-500 mb-2">1 month ago</p>
                          <p>Excellent service! Delivered exactly what I wanted and ahead of schedule.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Button 
                    variant={selectedPackage === "basic" ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => setSelectedPackage("basic")}
                  >
                    Basic
                  </Button>
                  <Button 
                    variant={selectedPackage === "standard" ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => setSelectedPackage("standard")}
                  >
                    Standard
                  </Button>
                  <Button 
                    variant={selectedPackage === "premium" ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => setSelectedPackage("premium")}
                  >
                    Premium
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-lg">
                      {selectedPackage === "basic" 
                        ? "Basic Package" 
                        : selectedPackage === "standard" 
                          ? "Standard Package" 
                          : "Premium Package"}
                    </h3>
                    <p className="font-bold text-lg">${gig.price}</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {selectedPackage === "basic" 
                      ? "Everything you need to get started" 
                      : selectedPackage === "standard" 
                        ? "Great for professionals" 
                        : "For those who need the best"}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Delivery Time</span>
                    <span className="font-medium">
                      {selectedPackage === "basic" 
                        ? gig.deliveryTime 
                        : selectedPackage === "standard" 
                          ? (gig.deliveryTime || 5) - 1
                          : (gig.deliveryTime || 5) - 2} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revisions</span>
                    <span className="font-medium">
                      {selectedPackage === "basic" 
                        ? gig.revisions 
                        : selectedPackage === "standard" 
                          ? (gig.revisions || 1) + 1
                          : "Unlimited"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-bold">
                      ${selectedPackage === "basic" 
                        ? gig.price 
                        : selectedPackage === "standard" 
                          ? gig.price * 1.5 
                          : gig.price * 2.5}
                    </span>
                  </div>
                </div>

                <Button className="w-full mb-4" onClick={handleOrderNow}>
                  Order Now
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Badge variant="outline">
                    {gig.orders || "10+"}+ orders in queue
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
