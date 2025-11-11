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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
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
      className={cn("flex-1 p-4", className)}
    >
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.fromUserId === user?.id;
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback 
                  className={cn(
                    "text-xs",
                    isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  {getInitials(message.fromUserName)}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn("flex flex-col gap-1", isOwnMessage ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {message.fromUserName}
                  </span>
                  {message.fromUserRole === 'admin' && (
                    <Badge variant="secondary" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
                
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTime(message.createdAt)}</span>
                  {isOwnMessage && message.isRead && (
                    <span className="text-green-500">✓ Đã đọc</span>
                  )}
                </div>
              </div>
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