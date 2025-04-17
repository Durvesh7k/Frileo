import { useEffect, useState } from "react";
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
import { Gig, User } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export default function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);

  // Find the gig with the matching ID
  const getGig = async () => {
    try {
      const response = await axiosInstance.get(`/gigs/${id}`);
      setGig(response.data);
      
      // Only attempt to get user after gig data is available
      if (response.data && response.data.user && response.data.user.id) {
        getUser(response.data.user.id);
      }
    } catch (err) {
      console.log("Error in fetching gig", err);
    } finally {
      setLoading(false);
    }
  }

  const getUser = async (userId) => {
    if (!userId) return;
    
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      setUser(response.data);
    } catch (err) {
      console.log("Error in fetching user", err);
    }
  }

  useEffect(() => {
    getGig();
  }, [id]); // Added id as dependency

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </Layout>
    );
  }

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
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>

            {user && (
              <div className="flex items-center mb-6">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={user.profilePic ? user.profilePic : "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"}
                  />
                  <AvatarFallback>{user.name?.[0] || "S"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center">
                    <RatingStars rating={user.reviews && user.reviews.length ? user.reviews[0].rating : 0} />
                    <span className="text-sm text-gray-500 ml-1">
                      ({user.reviews ? user.reviews.length : 0})
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={gig.images && gig.images.length > 0 ? gig.images[selectedImage] : "/placeholder.svg"}
                alt={gig.title}
                className="w-full h-[400px] object-cover"
              />
              {gig.images && gig.images.length > 0 && (
                <div className="flex mt-4">
                  {gig.images.map((image, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 mr-2 rounded-sm ${selectedImage === index ? 'border-2 border-blue-500' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">About This Gig</h2>
              <p className="text-gray-700">{gig.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Category</h2>
              <p className="text-gray-700">{gig.category}</p>
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
                  Yes, revisions are included based on the package.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {user && user.reviews && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {user.reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.user && review.user.profilePic ? review.user.profilePic : "/placeholder.svg"} />
                            <AvatarFallback>{review.user && review.user.name ? review.user.name[0] : "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center mb-1">
                              <p className="font-medium mr-2">{review.user ? review.user.name : "Anonymous"}</p>
                              <RatingStars rating={review.rating} />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{review.createdAt}</p>
                            <p>{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-lg">Price</h3>
                    <p className="font-bold text-lg">${gig.price}</p>
                  </div>
                </div>

                <Button className="w-full mb-4" onClick={handleOrderNow}>
                  Order Now
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Badge variant="outline">
                    {gig.orders && gig.orders.length ? gig.orders.length : "10+"} orders in queue
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