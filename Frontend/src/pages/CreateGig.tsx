import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { categories } from "@/data/mock";
import axiosInstance from "@/utils/axiosInstance";
import { bucket_id, client } from "@/utils/appwrite";
import { ID, Storage } from "appwrite";
import { X } from "lucide-react";

const createGigSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  description: z.string().min(50, "Description must be at least 50 characters").max(1000),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().min(5, "Minimum price is $5").max(10000),
  deliveryTime: z.coerce.number().min(1, "Delivery time must be at least 1 day"),
});

type CreateGigFormValues = z.infer<typeof createGigSchema>;

export default function CreateGig() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<CreateGigFormValues>({
    resolver: zodResolver(createGigSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 5,
      deliveryTime: 1,
    },
  });

  async function onSubmit(data: CreateGigFormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a gig",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (imageFiles.length === 0) {
      toast({
        title: "Image required",
        description: "Please upload at least one image for your gig",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const storage = new Storage(client);
      const imageUrls: string[] = [];

      // Upload each image and collect URLs
      for (const imageFile of imageFiles) {
        const storageResponse = await storage.createFile(
          bucket_id,
          ID.unique(),
          imageFile
        );
        
        const image_url = storage.getFileView(bucket_id, storageResponse.$id);
        imageUrls.push(image_url);
      }

      console.log("Sending data:", {
        title: data.title,
        description: data.description,
        category: data.category, // This is now the category name
        price: data.price,
        deliveryTime: data.deliveryTime,
        images: imageUrls
      });
            
      // Create gig with array of image URLs and category name
      const response = await axiosInstance.post("/gigs", {
        title: data.title,
        description: data.description,
        category: data.category, // This is now the category name
        price: data.price,
        deliveryTime: data.deliveryTime,
        images: imageUrls  // Array of image URLs
      });

      toast({
        title: "Gig created successfully",
        description: "Your gig has been published and is now visible to buyers",
      });

      navigate("/profile");
    } catch (error) {
      toast({
        title: "Error creating gig",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array and add to existing files (up to max 5)
    const newFiles = Array.from(files);
    
    // Limit total images to 5
    const totalFiles = [...imageFiles, ...newFiles];
    if (totalFiles.length > 5) {
      toast({
        title: "Too many images",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    setImageFiles(totalFiles);
    
    // Create previews for all new files
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to create a gig</h1>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a New Gig</h1>

          <Card>
            <CardHeader>
              <CardTitle>Gig Details</CardTitle>
              <CardDescription>
                Fill in the details below to create your new service offering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gig Title</FormLabel>
                        <FormControl>
                          <Input placeholder="I will..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Clearly describe the service you're offering.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gig Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of your service..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include what buyers will receive, your process, and turnaround time.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category that best fits your service.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" min="5" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set a competitive price for your service (minimum $5).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Time (in days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the number of days it will take to deliver this gig.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Gig Images (Up to 5)</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {imagePreviews.length > 0 ? (
                        <div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${index}`}
                                  className="h-32 w-full object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          {imagePreviews.length < 5 && (
                            <div className="text-center">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="gig-image"
                                multiple
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("gig-image")?.click()}
                              >
                                Add More Images
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <p className="text-gray-500">Upload images to showcase your gig (required)</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="gig-image"
                            multiple
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("gig-image")?.click()}
                          >
                            Select Images
                          </Button>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Upload up to 5 high-quality images that represent your service.
                    </FormDescription>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Gig..." : "Create Gig"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}