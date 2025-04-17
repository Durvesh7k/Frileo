import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import GigCard from "@/components/gigs/GigCard";
import axiosInstance from "@/utils/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bucket_id, client } from "@/utils/appwrite";
import { ID, Storage } from "appwrite";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [localUser, setLocalUser] = useState(null);
  const fileInputRef = useRef(null);

  const getGigs = async () => {
    try {
      const response = await axiosInstance.get("/gigs");
      setGigs(response.data);
    } catch (err) {
      console.log("Error in fetching gigs", err);
    }
  };

  const getUser = async() => {
    try {
      const response = await axiosInstance.get("/user");
      setLocalUser(response.data);
    } catch (err) {
      console.log("Error in fetching gigs", err);
    }
  }

  useEffect(() => {
    getUser();
    getGigs();
    // Initialize local user state and profile image when user data is available
    if (user) {
      setLocalUser(user);
      setProfileImage(user.profilePic || "");
    }
  }, [user]);

  const userGigs = localUser ? gigs.filter((gig) => gig.userId === localUser.id) : [];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: localUser?.name || "",
      bio: localUser?.bio || "",
      skills: Array.isArray(localUser?.skills) ? localUser.skills.join(", ") : localUser?.skills || "",
    },
  });

  // Reset form values when localUser changes
  useEffect(() => {
    if (localUser) {
      form.reset({
        name: localUser.name || "",
        bio: localUser.bio || "",
        skills: Array.isArray(localUser.skills)
          ? localUser.skills
          : typeof localUser.skills === "string"
            ? localUser.skills.split(",").map(s => s.trim())
            : []
      });
    }

  }, [localUser, form]);

  // Handles file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Generate a unique file name to prevent overwrites
      const storage = await new Storage(client);

      // Upload file to Appwrite Storage
      const uploadResult = await storage.createFile(
        bucket_id,
        ID.unique(),
        file
      );

      // Get the file URL
      const fileUrl = storage.getFileView(bucket_id, uploadResult.$id);

      // Update the local state
      setProfileImage(fileUrl);

      toast({
        title: "Image uploaded",
        description: "Profile picture has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      // Include the profile image URL in the data to be sent
      const updatedData = {
        ...data,
        profilePic: profileImage,
        skills: data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
      };

      const response = await axiosInstance.put(`/user/${localUser.id}`, updatedData);

      // Update local user state with the new data
      // Using a simple state update rather than a function-based update
      if (response.data) {
        setLocalUser({
          ...localUser,
          name: data.name || localUser.name,
          bio: data.bio || localUser.bio,
          skills: data.skills || localUser.skills,
          profilePic: profileImage || localUser.profilePic
        });
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error?.response?.data?.error || "Something went wrong.",
        variant: "destructive",
      });
    }
  }

  // Generate a fallback avatar based on user's name
  const getNameInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  if (!localUser) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
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
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Profile Picture Upload */}
                      <div className="flex flex-col items-center mb-6">
                        <Avatar className="w-24 h-24 mb-2">
                          <AvatarImage src={profileImage} />
                          <AvatarFallback className="text-lg">{getNameInitials(localUser.name)}</AvatarFallback>
                        </Avatar>

                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          onClick={triggerFileInput}
                          disabled={isUploading}
                          className="mt-2"
                        >
                          {isUploading ? "Uploading..." : "Change Profile Picture"}
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email field - read only */}
                      <div className="space-y-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          id="email"
                          type="email"
                          value={localUser.email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., React, Node.js" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button type="submit" disabled={isUploading}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center mb-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={localUser.profilePic} />
                        <AvatarFallback className="text-lg">{getNameInitials(localUser.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p>{localUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{localUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bio</p>
                      <p>{localUser.bio || "No bio provided."}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Skills</p>
                      <p>{localUser.skills || "No skills added."}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Type</p>
                      <p className="capitalize">{localUser.role}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p>{new Date(localUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="gigs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gigs">My Gigs</TabsTrigger>
                <TabsTrigger value="stats">Stats & Earnings</TabsTrigger>
              </TabsList>

              <TabsContent value="gigs" className="space-y-4">
                {userGigs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userGigs.map((gig) => (
                      <GigCard key={gig.id} gig={gig} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900">No gigs found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      You haven't created any gigs yet.
                    </p>
                    <Button className="mt-4" asChild>
                      <a href="/create-gig">Create Your First Gig</a>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings & Statistics</CardTitle>
                    <CardDescription>View your performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                        <p className="text-2xl font-bold">$0.00</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-500">Active Orders</p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                    </div>
                    <p className="text-center text-gray-500">
                      Start creating gigs and completing orders to see your statistics here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}