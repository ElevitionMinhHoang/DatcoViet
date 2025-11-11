import { useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types';

export function useChatNotifications() {
  const { conversations, activeConversation, messages } = useChat();
  const { toast } = useToast();
  const [lastMessageId, setLastMessageId] = useState<string>('');

  useEffect(() => {
    // Check for new messages
    const latestMessage = messages[messages.length - 1];
    
    if (latestMessage && latestMessage.id !== lastMessageId) {
      // Don't show notification for own messages or when conversation is active
      const isOwnMessage = latestMessage.fromUserId === activeConversation?.participants.find(p => p.userId === latestMessage.fromUserId)?.userId;
      const isActiveConversation = activeConversation?.id === latestMessage.conversationId;
      
      if (!isOwnMessage && !isActiveConversation) {
        // Show notification
        toast({
          title: `Tin nhắn mới từ ${latestMessage.fromUserName}`,
          description: latestMessage.content,
          duration: 5000,
        });
      }
      
      setLastMessageId(latestMessage.id);
    }
  }, [messages, activeConversation, lastMessageId, toast]);

  // Check for new conversations
  useEffect(() => {
    const unreadConversations = conversations.filter(conv => conv.unreadCount > 0);
    
    if (unreadConversations.length > 0) {
      // You could add a more sophisticated notification system here
      // For now, we'll rely on the toast notifications for new messages
    }
  }, [conversations]);

  return {
    unreadCount: conversations.reduce((total, conv) => total + conv.unreadCount, 0),
    hasNewMessages: conversations.some(conv => conv.unreadCount > 0)
  };
}