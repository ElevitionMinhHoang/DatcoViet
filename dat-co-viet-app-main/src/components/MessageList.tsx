import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  className?: string;
}

export function MessageList({ messages, className }: MessageListProps) {
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      } else if (scrollAreaRef.current) {
        // Fallback: try to find the viewport element
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          (viewport as HTMLDivElement).scrollTop = (viewport as HTMLDivElement).scrollHeight;
        }
      }
    };

    // Use setTimeout to ensure the DOM is updated before scrolling
    setTimeout(scrollToBottom, 0);
  }, [messages]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className={cn("flex-1", className)}
    >
      <div className="p-4 space-y-4 min-h-full">
        {messages.map((message) => {
          // Ensure both IDs are strings for comparison
          const isOwnMessage = String(message.fromUserId) === String(user?.id);
          const isAdminMessage = message.fromUserRole === 'admin';
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                isOwnMessage ? "justify-end" : "justify-start"
              )}
            >
              {isOwnMessage ? (
                // Sender messages - Right side with footer gradient
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex flex-col gap-1 items-end">
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm max-w-full break-words",
                        "bg-gradient-to-r from-primary to-primary/60 text-white"
                      )}
                    >
                      {message.content}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <span>{formatTime(message.createdAt)}</span>
                      {message.isRead && (
                        <span className="text-green-500 ml-2">✓ Đã đọc</span>
                      )}
                    </div>
                  </div>
                  
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className="bg-primary text-primary-foreground text-xs"
                    >
                      {getInitials(user?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                // Receiver messages - Left side with gray background
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={cn(
                        "text-xs text-black",
                        isAdminMessage ? "bg-blue-500" : "bg-muted"
                      )}
                    >
                      {getInitials(message.fromUserName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {isAdminMessage ? 'Hỗ trợ Hoa nắng' : message.fromUserName}
                      </span>
                      {isAdminMessage && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Hỗ trợ
                        </Badge>
                      )}
                    </div>
                    
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm max-w-full break-words",
                        "bg-gray-100 text-gray-900"
                      )}
                    >
                      {message.content}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <span>{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Chưa có tin nhắn nào</p>
            <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}