import React from 'react';
import { Conversation, Message } from '@/types';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { X, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  conversation: Conversation;
  onClose?: () => void;
  className?: string;
  showHeader?: boolean;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function ChatWindow({ 
  conversation, 
  onClose, 
  className,
  showHeader = true 
}: ChatWindowProps) {
  const { messages, sendMessage, isLoading } = useChat();
  const { user } = useAuth();

  const otherParticipant = conversation.participants.find(p => p.userId !== user?.id);
  const conversationMessages = messages.filter(msg => msg.conversationId === conversation.id);

  const handleSendMessage = async (content: string) => {
    await sendMessage(conversation.id, content);
  };

  if (isLoading) {
    return (
      <Card className={cn("flex flex-col h-[500px]", className)}>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Đang tải tin nhắn...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("flex flex-col h-[600px] max-h-[80vh]", className)}>
      {showHeader && (
        <CardHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  HH
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {user?.role === 'admin' || user?.role === 'staff' || user?.role === 'ADMIN' || user?.role === 'CSKH' || user?.role === 'MANAGER'
                      ? conversation.participants.find(p => p.userRole === 'customer')?.userName || 'Người dùng'
                      : 'Hỗ trợ Hoa nắng'
                    }
                  </span>
                  {(user?.role !== 'admin' && user?.role !== 'staff' && user?.role !== 'ADMIN' && user?.role !== 'CSKH' && user?.role !== 'MANAGER') && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Hỗ trợ
                    </Badge>
                  )}
                </div>
                
                {/* Status line removed */}
              </div>
            </div>
            
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {conversation.orderId && (
            <div className="mt-2 text-xs text-muted-foreground">
              Liên quan đến đơn hàng: <span className="font-medium">#{conversation.orderId}</span>
            </div>
          )}
        </CardHeader>
      )}
      
      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        <MessageList messages={conversationMessages} className="flex-1" />
        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder="Nhập tin nhắn..."
        />
      </CardContent>
    </Card>
  );
}

// Compact version for sidebar or list view
interface CompactChatWindowProps {
  conversation: Conversation;
  onSelect: () => void;
  isActive?: boolean;
}

export function CompactChatWindow({ conversation, onSelect, isActive }: CompactChatWindowProps) {
  const { user } = useAuth();
  const otherParticipant = conversation.participants.find(p => p.userId !== user?.id);

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-auto p-3",
        isActive && "bg-muted"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 w-full">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="text-black text-xs">
            {user?.role === 'admin' || user?.role === 'staff' || user?.role === 'ADMIN' || user?.role === 'CSKH' || user?.role === 'MANAGER'
              ? conversation.participants.find(p => p.userRole === 'customer')?.userName?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'HH'
              : 'HH'
            }
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium truncate">
              {user?.role === 'admin' || user?.role === 'staff' || user?.role === 'ADMIN' || user?.role === 'CSKH' || user?.role === 'MANAGER'
                ? conversation.participants.find(p => p.userRole === 'customer')?.userName || 'Người dùng'
                : 'Hỗ trợ Hoa nắng'
              }
            </span>
            {conversation.unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground truncate">
            {conversation.lastMessage?.content || ''}
          </p>
        </div>
      </div>
    </Button>
  );
}