import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Conversation, Message, ChatContextType } from '@/types';
import { conversations as mockConversations, messages as mockMessages } from '@/data/mockData';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions to get participant info
  const getOtherParticipantId = (conversationId: string): string => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation || !user) return '';
    return conversation.participantIds.find(id => id !== user.id) || '';
  };

  const getOtherParticipantName = (conversationId: string): string => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation || !user) return '';
    const participant = conversation.participants.find(p => p.userId !== user.id);
    return participant?.userName || '';
  };

  const getOtherParticipantRole = (conversationId: string): 'customer' | 'staff' | 'admin' => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation || !user) return 'customer';
    const participant = conversation.participants.find(p => p.userId !== user.id);
    return participant?.userRole || 'customer';
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter conversations for current user
      const userConversations = mockConversations.filter(conv => 
        conv.participantIds.includes(user?.id || '')
      );
      
      setConversations(userConversations);
      
      // Load messages for active conversation if any
      if (activeConversation) {
        const conversationMessages = mockMessages.filter(
          msg => msg.conversationId === activeConversation.id
        );
        setMessages(conversationMessages);
      }
      
      setIsLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user, activeConversation]);

  // Calculate unread count
  const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const sendMessage = async (conversationId: string, content: string, messageType: 'text' | 'image' = 'text'): Promise<void> => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      fromUserId: user.id,
      fromUserName: user.name,
      fromUserRole: user.role,
      toUserId: getOtherParticipantId(conversationId),
      toUserName: getOtherParticipantName(conversationId),
      toUserRole: getOtherParticipantRole(conversationId),
      content,
      messageType,
      isRead: false,
      createdAt: new Date()
    };

    // Add to messages
    setMessages(prev => [...prev, newMessage]);

    // Update conversation last message and unread count
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: newMessage,
          unreadCount: user.role === 'admin' ? 0 : conv.unreadCount + 1,
          updatedAt: new Date()
        };
      }
      return conv;
    }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
  };

  const markAsRead = (conversationId: string) => {
    if (!user) return;

    // Mark messages as read
    setMessages(prev => prev.map(msg => 
      msg.conversationId === conversationId && !msg.isRead 
        ? { ...msg, isRead: true, readAt: new Date() }
        : msg
    ));

    // Update conversation unread count
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));

    // Update participant's last read time
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          participants: conv.participants.map(p => 
            p.userId === user.id 
              ? { ...p, lastReadAt: new Date() }
              : p
          )
        };
      }
      return conv;
    }));
  };

  const createConversation = (participantIds: string[], orderId?: string): string => {
    const newConversationId = `conv-${Date.now()}`;
    
    // Find existing conversation with same participants
    const existingConversation = conversations.find(conv => 
      conv.participantIds.length === participantIds.length &&
      conv.participantIds.every(id => participantIds.includes(id))
    );

    if (existingConversation) {
      setActiveConversation(existingConversation);
      return existingConversation.id;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: newConversationId,
      participantIds,
      participants: participantIds.map(id => ({
        userId: id,
        userName: id === '1' ? 'Quản trị viên' : 'Người dùng',
        userRole: id === '1' ? 'admin' : 'customer'
      })),
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderId,
      status: 'active'
    };

    setConversations(prev => [...prev, newConversation]);
    setActiveConversation(newConversation);
    
    return newConversationId;
  };

  const setActiveConversationHandler = (conversationId: string | null) => {
    if (!conversationId) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setActiveConversation(conversation);
      
      // Load messages for this conversation
      const conversationMessages = mockMessages.filter(
        msg => msg.conversationId === conversationId
      );
      setMessages(conversationMessages);
      
      // Mark as read if user is viewing
      markAsRead(conversationId);
    }
  };

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    unreadCount,
    sendMessage,
    markAsRead,
    createConversation,
    setActiveConversation: setActiveConversationHandler,
    isLoading
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}