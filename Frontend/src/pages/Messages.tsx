import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import MessagesList from "@/components/messages/MessagesList";
import ConversationView from "@/components/messages/ConversationView";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Conversation, Message } from "@/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

// Mock data for conversations
const mockConversations: Conversation[] = [
    {
        id: "conv1",
        participantIds: ["user1", "user2"],
        participantNames: ["John Buyer", "Sarah Seller"],
        participantAvatars: ["/placeholder.svg", "/placeholder.svg"],
        lastMessage: "Thanks for the quick delivery!",
        lastMessageTime: new Date().toISOString(),
        orderId: "order123",
        gigId: "gig456",
        unreadCount: 2
    },
    {
        id: "conv2",
        participantIds: ["user1", "user3"],
        participantNames: ["John Buyer", "Mike Designer"],
        participantAvatars: ["/placeholder.svg", "/placeholder.svg"],
        lastMessage: "I'll send you the draft tomorrow",
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        orderId: "order456",
        gigId: "gig789",
        unreadCount: 0
    }
];

// Mock data for messages
const mockMessages: Record<string, Message[]> = {
    "conv1": [
        {
            id: "msg1",
            conversationId: "conv1",
            senderId: "user2",
            senderName: "Sarah Seller",
            senderAvatar: "/placeholder.svg",
            receiverId: "user1",
            content: "Hey there! I've started working on your order.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isRead: true
        },
        {
            id: "msg2",
            conversationId: "conv1",
            senderId: "user1",
            senderName: "John Buyer",
            senderAvatar: "/placeholder.svg",
            receiverId: "user2",
            content: "Great! Looking forward to seeing the progress.",
            createdAt: new Date(Date.now() - 82800000).toISOString(),
            isRead: true
        },
        {
            id: "msg3",
            conversationId: "conv1",
            senderId: "user2",
            senderName: "Sarah Seller",
            senderAvatar: "/placeholder.svg",
            receiverId: "user1",
            content: "I've completed the first draft. Please check it out and let me know your thoughts!",
            createdAt: new Date(Date.now() - 43200000).toISOString(),
            isRead: true
        },
        {
            id: "msg4",
            conversationId: "conv1",
            senderId: "user1",
            senderName: "John Buyer",
            senderAvatar: "/placeholder.svg",
            receiverId: "user2",
            content: "Thanks for the quick delivery!",
            createdAt: new Date().toISOString(),
            isRead: false
        }
    ],
    "conv2": [
        {
            id: "msg5",
            conversationId: "conv2",
            senderId: "user3",
            senderName: "Mike Designer",
            senderAvatar: "/placeholder.svg",
            receiverId: "user1",
            content: "Hello! I received your order for the logo design.",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            isRead: true
        },
        {
            id: "msg6",
            conversationId: "conv2",
            senderId: "user1",
            senderName: "John Buyer",
            senderAvatar: "/placeholder.svg",
            receiverId: "user3",
            content: "Hi Mike! Yes, I'm looking for a minimalist logo that represents my brand.",
            createdAt: new Date(Date.now() - 169200000).toISOString(),
            isRead: true
        },
        {
            id: "msg7",
            conversationId: "conv2",
            senderId: "user3",
            senderName: "Mike Designer",
            senderAvatar: "/placeholder.svg",
            receiverId: "user1",
            content: "I'll send you the draft tomorrow",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isRead: true
        }
    ]
};

export default function Messages() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
    const [activeConversation, setActiveConversation] = useState<string | null>(
        conversations.length > 0 ? conversations[0].id : null
    );
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSendMessage = (content: string) => {
        if (!activeConversation || !user) return;

        const conversation = conversations.find(c => c.id === activeConversation);
        if (!conversation) return;

        const receiverId = conversation.participantIds.find(id => id !== user.id) || "";
        const receiverName = conversation.participantNames.find(
            (_, i) => conversation.participantIds[i] !== user.id
        ) || "";

        const newMessage: Message = {
            id: `msg${Date.now()}`,
            conversationId: activeConversation,
            senderId: user.id,
            senderName: user.name,
            senderAvatar: user.avatar,
            receiverId,
            content,
            createdAt: new Date().toISOString(),
            isRead: false
        };

        // Update messages for the active conversation
        setMessages(prev => ({
            ...prev,
            [activeConversation]: [...(prev[activeConversation] || []), newMessage],
        }));

        // Update last message in conversation list
        setConversations(prev =>
            prev.map(conv =>
                conv.id === activeConversation
                    ? {
                        ...conv,
                        lastMessage: content,
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: 0, // Reset own unread count
                    }
                    : conv
            )
        );

        toast({
            title: "Message sent",
            description: `Your message to ${receiverName} has been sent`,
        });
    };

    const handleSelectConversation = (conversationId: string) => {
        setActiveConversation(conversationId);
        setMobileOpen(false);

        // Mark messages as read when selecting a conversation
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId
                    ? { ...conv, unreadCount: 0 }
                    : conv
            )
        );
    };

    const activeMessages = activeConversation ? messages[activeConversation] || [] : [];
    const activeConversationData = conversations.find(c => c.id === activeConversation);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Messages</h1>
                    <p className="text-gray-600">
                        Communicate with buyers and sellers about your orders.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Mobile view - conversation list toggle */}
                    <div className="lg:hidden mb-4">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full flex items-center gap-2">
                                    <Users size={16} />
                                    View Conversations
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[85%] sm:w-[385px] p-0">
                                <div className="p-6 border-b">
                                    <h2 className="text-xl font-bold">Conversations</h2>
                                </div>
                                <div className="p-4">
                                    <MessagesList
                                        conversations={conversations}
                                        onSelect={handleSelectConversation}
                                        activeConversationId={activeConversation || undefined}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop view - conversation list */}
                    <div className="hidden lg:block lg:col-span-1 border rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-semibold">Conversations</h2>
                        </div>
                        <div className="p-3">
                            <MessagesList
                                conversations={conversations}
                                onSelect={handleSelectConversation}
                                activeConversationId={activeConversation || undefined}
                            />
                        </div>
                    </div>

                    {/* Conversation view */}
                    <div className="lg:col-span-3 border rounded-lg shadow-sm overflow-hidden h-[calc(100vh-300px)]">
                        {activeConversation && activeConversationData ? (
                            <ConversationView
                                conversation={activeConversationData}
                                messages={activeMessages}
                                onSendMessage={handleSendMessage}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                                <p className="text-gray-500 mb-4">
                                    Select a conversation from the list or start a new one from an order.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}