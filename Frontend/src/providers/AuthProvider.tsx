import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, LoginFormData, RegisterFormData } from "@/types";
import { users } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";
import { saveToken } from "../utils/auth" // Adjust path as per your project
import axiosInstance from "../utils/axiosInstance";

interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem("freelanceflow_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", data); // assumes your backend endpoint is /auth/login
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem("freelanceflow_user", JSON.stringify(user));
      saveToken(token); // saves to localStorage or cookies depending on your implementation

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const register = async (data: RegisterFormData): Promise<boolean> => {
    setIsLoading(true);

    try {
      if (data.password !== data.confirmPassword) {
        toast({
          title: "Registration failed",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return false;
      }

      const response = await axiosInstance.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role, // Make sure role is part of RegisterFormData type
      });

      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem("freelanceflow_user", JSON.stringify(user));
      saveToken(token);

      toast({
        title: "Registration successful",
        description: `Welcome, ${user.name}!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("freelanceflow_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
