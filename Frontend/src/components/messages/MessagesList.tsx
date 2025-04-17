import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Conversation } from "@/types";
import { useAuth } from "@/providers/AuthProvider";

interface MessagesListProps {
    conversations: Conversation[];
    onSelect: (conversationId: string) => void;
    activeConversationId?: string;
}

export default function MessagesList({
    conversations,
    onSelect,
    activeConversationId
}: MessagesListProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <p className="text-gray-500 mb-4">No conversations yet</p>
                <button
                    className="text-primary underline"
                    onClick={() => navigate("/gigs")}
                >
                    Browse gigs to start a conversation
                </button>
            </div>
        );
    }

    const getOtherParticipantName = (conversation: Conversation) => {
        const otherParticipantName = conversation.participantNames.find(
            name => user && name !== user.name
        ) || conversation.participantNames[0];
        return otherParticipantName;
    };

    const getOtherParticipantAvatar = (conversation: Conversation) => {
        if (!conversation.participantAvatars) return undefined;

        const otherParticipantIndex = conversation.participantNames.findIndex(
            name => user && name !== user.name
        );

        return otherParticipantIndex >= 0
            ? conversation.participantAvatars[otherParticipantIndex]
            : conversation.participantAvatars[0];
    };

    return (
        <div className="overflow-y-auto h-[calc(100vh-210px)]">
            {conversations.map((conversation) => {
                const otherParticipantName = getOtherParticipantName(conversation);
                const otherParticipantAvatar = getOtherParticipantAvatar(conversation);
                const isActive = activeConversationId === conversation.id;

                return (
                    <Card
                        key={conversation.id}
                        className={`px-4 py-3 mb-2 cursor-pointer hover:bg-gray-50 transition-colors ${isActive ? "bg-gray-100 border-primary" : ""
                            }`}
                        onClick={() => onSelect(conversation.id)}
                    >
                        <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={otherParticipantAvatar || "/placeholder.svg"} />
                                <AvatarFallback>{otherParticipantName[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-sm truncate">{otherParticipantName}</h4>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                        {conversation.lastMessageTime
                                            ? formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })
                                            : ""}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-gray-600 text-sm truncate">{conversation.lastMessage || "No messages yet"}</p>
                                    {conversation.unreadCount > 0 && (
                                        <Badge variant="secondary" className="ml-2 bg-primary text-white">
                                            {conversation.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
