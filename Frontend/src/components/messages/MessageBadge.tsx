import React from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageBadgeProps {
    count: number;
    onClick?: () => void;
}

export default function MessageBadge({ count, onClick }: MessageBadgeProps) {
    if (count === 0) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onClick}
                            className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <MessageCircle size={20} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Messages</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={onClick}
                        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <MessageCircle size={20} />
                        <Badge
                            className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center bg-primary text-white"
                        >
                            {count > 99 ? "99+" : count}
                        </Badge>
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>You have {count} unread {count === 1 ? "message" : "messages"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
