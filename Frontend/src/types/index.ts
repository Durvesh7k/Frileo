export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars?: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  orderId?: string;
  gigId?: string;
  unreadCount: number;
}



export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string; // optional if bio is not always available
  profilePic?: string; // optional if profilePic is not always available
  skills?: string[]; // assuming skills are an array of strings
  role: 'buyer' | 'seller' | 'both';
  createdAt: string;
  gigs: Gig[]; // Assuming you have a Gig type
  reviews: Review[]; // Assuming you have a Review type
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  gigId: string;
  user: User;  
  gig: Gig;    
  createdAt: string; 
}


export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  category: string;
  images: string[];
  user: User
  createdAt: string;
  orders: Order[];   // Replace `any` with your actual Order type if defined
}


export interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "SELLER" | "BUYER" | "BOTH"; // adjust as per your roles
}


export interface CreateGigFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  image?: File;
}
