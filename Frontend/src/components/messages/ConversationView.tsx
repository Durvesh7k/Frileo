import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { Message, Conversation } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationViewProps {
    conversation: Conversation;
    messages: Message[];
    onSendMessage: (content: string) => void;
}

export default function ConversationView({
    conversation,
    messages,
    onSendMessage
}: ConversationViewProps) {
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getOtherParticipantName = () => {
        return conversation.participantNames.find(
            name => user && name !== user.name
        ) || conversation.participantNames[0];
    };

    const getOtherParticipantAvatar = () => {
        if (!conversation.participantAvatars) return undefined;

        const otherParticipantIndex = conversation.participantNames.findIndex(
            name => user && name !== user.name
        );

        return otherParticipantIndex >= 0
            ? conversation.participantAvatars[otherParticipantIndex]
            : conversation.participantAvatars[0];
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Conversation header */}
            <div className="p-4 border-b flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={getOtherParticipantAvatar() || "/placeholder.svg"} />
                    <AvatarFallback>{getOtherParticipantName()[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-medium">{getOtherParticipantName()}</h3>
                    {conversation.gigId && (
                        <p className="text-xs text-gray-500">
                            Related to order #{conversation.orderId?.slice(-6)}
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isCurrentUser = user && message.senderId === user.id;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div className="flex max-w-[75%]">
                                        {!isCurrentUser && (
                                            <Avatar className="h-8 w-8 mr-2 mt-1">
                                                <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                                                <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div>
                                            <div
                                                className={`rounded-lg p-3 ${isCurrentUser
                                                        ? "bg-primary text-white rounded-tr-none"
                                                        : "bg-gray-100 rounded-tl-none"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                    <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 min-h-[60px] resize-none"
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="h-10 w-10"
                        disabled={!newMessage.trim()}
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}