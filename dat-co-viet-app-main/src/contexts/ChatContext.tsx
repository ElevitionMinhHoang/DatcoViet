import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Conversation, Message, ChatContextType, User } from '@/types';
import { chatAPI } from '@/services/api';
import io, { Socket } from 'socket.io-client';

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const activeConversationRef = useRef<Conversation | null>(null);

  // Keep ref in sync with activeConversation
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        const newSocket = io('http://localhost:3000', {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Connected to chat server');
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from chat server');
        });

        newSocket.on('new_message', (message: any) => {
          console.log('New message received:', message);
          
          // Log the raw message for debugging
          console.log('Raw message fields:', Object.keys(message));
          console.log('message.roomId:', message.roomId, 'message.sender:', message.sender);
           
          // Format the message to match our Message type
          const formattedMessage = {
            id: message.id?.toString() || `socket-${Date.now()}`,
            conversationId: message.roomId?.toString() || message.conversationId,
            fromUserId: message.fromUserId?.toString() || message.senderId?.toString(),
            fromUserName: message.fromUserName || message.sender?.name || 'Người dùng',
            fromUserRole: message.fromUserRole || message.sender?.role || 'customer',
            toUserId: message.toUserId || 'admin',
            toUserName: message.toUserName || 'Hỗ trợ Hoa nắng',
            toUserRole: message.toUserRole || 'admin',
            content: message.content || message.message,
            messageType: message.messageType || 'text',
            isRead: message.isRead || false,
            createdAt: new Date(message.createdAt || Date.now()),
            readAt: message.readAt ? new Date(message.readAt) : undefined
          };

          // Check if this is our own message (optimistic update)
          const isOwnMessage = formattedMessage.fromUserId === user?.id?.toString();
          
          if (isOwnMessage) {
            // For our own messages, replace the optimistic message with the real one
            setMessages(prev => {
              // Remove any optimistic messages with the same content and same sender
              const filtered = prev.filter(msg =>
                !(msg.id.startsWith('temp-') &&
                  msg.content === formattedMessage.content &&
                  msg.fromUserId === formattedMessage.fromUserId)
              );
              return [...filtered, formattedMessage];
            });
          } else {
            // For other people's messages, add with duplicate prevention by ID
            setMessages(prev => {
              // Check if message with same ID already exists
              const messageExists = prev.some(msg => msg.id === formattedMessage.id);
              if (messageExists) {
                return prev; // Don't add duplicate
              }
              return [...prev, formattedMessage];
            });
          }
          
          // Update conversation last message and increment unread count if message is not from current user
          setConversations(prev => prev.map(conv => {
            if (conv.id === message.roomId?.toString() || conv.id === message.conversationId) {
              const isOwnMessage = formattedMessage.fromUserId === user?.id?.toString();
              const shouldIncrement = !isOwnMessage && !formattedMessage.isRead;
              return {
                ...conv,
                lastMessage: formattedMessage,
                unreadCount: shouldIncrement ? conv.unreadCount + 1 : conv.unreadCount
              };
            }
            return conv;
          }));
        });

        newSocket.on('messages_read', (data: { roomId: number; userId: number }) => {
          // Handle messages read event
          console.log('Messages read:', data);
        });

        newSocket.on('new_message_notification', (data: { roomId: number; message: any }) => {
          console.log('New message notification received:', data);
          // Format the message
          const formattedMessage = {
            id: data.message.id?.toString() || `socket-${Date.now()}`,
            conversationId: data.roomId.toString(),
            fromUserId: data.message.senderId?.toString() || data.message.sender?.id?.toString(),
            fromUserName: data.message.sender?.name || 'Người dùng',
            fromUserRole: (data.message.sender?.role || 'customer') as User['role'],
            toUserId: 'admin',
            toUserName: 'Hỗ trợ Hoa nắng',
            toUserRole: 'admin' as User['role'],
            content: data.message.message || data.message.content,
            messageType: 'text' as const,
            isRead: false,
            createdAt: new Date(data.message.createdAt || Date.now()),
            readAt: undefined
          };

          // Update conversation list for admin users
          // If the conversation exists, update its last message and increment unread count
          setConversations(prev => prev.map(conv => {
            if (conv.id === data.roomId.toString()) {
              return {
                ...conv,
                lastMessage: formattedMessage,
                unreadCount: conv.unreadCount + 1
              };
            }
            return conv;
          }));

          // If the active conversation matches this room, also add the message to messages
          if (activeConversationRef.current?.id === data.roomId.toString()) {
            setMessages(prev => {
              // Check if message with same ID already exists
              const messageExists = prev.some(msg => msg.id === formattedMessage.id);
              if (messageExists) {
                return prev;
              }
              return [...prev, formattedMessage];
            });
          }
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
      }
    }
  }, [user]);

  // Re-join chat room when socket reconnects or active conversation changes
  useEffect(() => {
    if (socket && activeConversationRef.current) {
      const roomId = parseInt(activeConversationRef.current.id);
      socket.emit('join_chat_room', roomId);
      console.log(`Re-joined chat room ${roomId} on socket change`);
    }
  }, [socket]);

  // Load conversations and messages
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        // Clear data when user logs out
        setConversations([]);
        setMessages([]);
        setActiveConversation(null);
        return;
      }

      setIsLoading(true);
      
      try {
        // Load conversations
        let userConversations: Conversation[] = [];
        
        if (user.role === 'admin' || user.role === 'ADMIN' || user.role === 'CSKH' || user.role === 'MANAGER') {
          // Admin can see all chat rooms
          const roomsData = await chatAPI.getChatRooms();
          userConversations = roomsData.map((room: any) => ({
            id: room.id.toString(),
            participantIds: [room.userId.toString(), 'admin'],
            participants: [
              {
                userId: room.userId.toString(),
                userName: room.user?.name || 'Người dùng',
                userRole: 'customer'
              },
              {
                userId: 'admin',
                userName: 'Hỗ trợ Hoa nắng',
                userRole: 'admin'
              }
            ],
            lastMessage: room.lastMessage,
            unreadCount: room.unreadCount || 0,
            createdAt: new Date(room.createdAt),
            updatedAt: new Date(room.updatedAt),
            status: room.status === 'ACTIVE' ? 'active' : 'resolved'
          }));
        } else {
          // Regular user gets their chat room - always create/get the same room
          const roomData = await chatAPI.getOrCreateChatRoom();
          const userConversation = {
            id: roomData.id.toString(),
            participantIds: [user.id.toString(), 'admin'],
            participants: [
              {
                userId: user.id.toString(),
                userName: user.name,
                userRole: user.role
              },
              {
                userId: 'admin',
                userName: 'Hỗ trợ Hoa nắng',
                userRole: 'admin'
              }
            ],
            lastMessage: roomData.lastMessage,
            unreadCount: roomData.unreadCount || 0,
            createdAt: new Date(roomData.createdAt),
            updatedAt: new Date(roomData.updatedAt),
            status: roomData.status === 'ACTIVE' ? 'active' : 'resolved'
          };
          userConversations = [userConversation as Conversation];

          // Auto-select the user's conversation if they don't have an active one
          // For regular users, always auto-select their support conversation
          const isAdminUser = (user.role as string) === 'admin' || (user.role as string) === 'ADMIN' || (user.role as string) === 'CSKH' || (user.role as string) === 'MANAGER' || (user.role as string) === 'staff';
          if (!activeConversation || !isAdminUser) {
            setActiveConversation(userConversation as Conversation);
          }
        }

        // Filter out any conversations where user is talking to themselves
        userConversations = userConversations.filter(conv => {
          // For regular users, only show conversations with admin
          if (user.role !== 'admin' && user.role !== 'ADMIN' && user.role !== 'CSKH' && user.role !== 'MANAGER') {
            return conv.participants.some(p => p.userRole === 'admin');
          }
          return true;
        });

        setConversations(userConversations);

        // Load messages for active conversation
        if (activeConversation) {
          await loadConversationMessages(activeConversation.id);
        }
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Load messages for a specific conversation
  const loadConversationMessages = async (conversationId: string) => {
    try {
      const roomId = parseInt(conversationId);
      const messagesData = await chatAPI.getChatRoomMessages(roomId);
      const formattedMessages = messagesData.map((msg: any) => ({
        id: msg.id.toString(),
        conversationId: msg.roomId.toString(),
        fromUserId: msg.senderId.toString(),
        fromUserName: msg.sender?.name || 'Người dùng',
        fromUserRole: msg.sender?.role || 'customer',
        toUserId: msg.roomId.toString(),
        toUserName: 'Người nhận',
        toUserRole: 'customer',
        content: msg.message,
        messageType: 'text',
        isRead: msg.isRead,
        createdAt: new Date(msg.createdAt),
        readAt: msg.readAt ? new Date(msg.readAt) : undefined
      }));
      
      // Clear existing messages before loading new ones to prevent duplicates
      setMessages([]);
      setMessages(formattedMessages);
      
      // Join the chat room via WebSocket
      if (socket) {
        socket.emit('join_chat_room', roomId);
        console.log(`Joined chat room ${roomId}`);
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    }
  };

  // Calculate unread count
  const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const sendMessage = async (conversationId: string, content: string): Promise<void> => {
    if (!user || !socket) return;

    try {
      const roomId = parseInt(conversationId);
      
      // Create optimistic message for immediate display
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        fromUserId: user.id.toString(),
        fromUserName: user.name,
        fromUserRole: user.role as any,
        toUserId: 'admin',
        toUserName: 'Hỗ trợ Hoa nắng',
        toUserRole: 'admin' as any,
        content,
        messageType: 'text',
        isRead: false, // Always false for sent messages - admin hasn't read it yet
        createdAt: new Date(),
        readAt: undefined
      };

      // Add optimistic message immediately for real-time feel
      setMessages(prev => [...prev, optimisticMessage]);

      // Send via WebSocket only - the backend will save it to database
      socket.emit('send_message', { roomId, message: content });

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      const roomId = parseInt(conversationId);
      await chatAPI.markMessagesAsRead(roomId);

      // Update local state
      setMessages(prev => prev.map(msg =>
        msg.conversationId === conversationId && !msg.isRead
          ? { ...msg, isRead: true, readAt: new Date() }
          : msg
      ));

      setConversations(prev => prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      ));

      // Emit WebSocket event
      if (socket) {
        socket.emit('mark_messages_read', roomId);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // Get all conversation IDs with unread messages
      const unreadConversations = conversations.filter(conv => conv.unreadCount > 0);
      // Call markAsRead for each conversation
      for (const conv of unreadConversations) {
        await markAsRead(conv.id);
      }
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  const createConversation = (participantIds: string[], orderId?: string): string => {
    // For now, return the user's existing conversation
    // In a real implementation, this would create a new conversation via API
    const userConversation = conversations.find(conv => 
      conv.participantIds.includes(user?.id || '')
    );
    
    if (userConversation) {
      setActiveConversation(userConversation);
      return userConversation.id;
    }

    // Create a temporary conversation (will be replaced by API response)
    const newConversationId = `temp-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      participantIds,
      participants: participantIds.map(id => ({
        userId: id,
        userName: id === 'admin' ? 'Hỗ trợ Hoa nắng' : user?.name || 'Người dùng',
        userRole: id === 'admin' ? 'admin' : user?.role || 'customer'
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

  const setActiveConversationHandler = async (conversationId: string | null) => {
    if (!conversationId) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setActiveConversation(conversation);
      await loadConversationMessages(conversationId);
      
      // Mark as read if user is viewing
      await markAsRead(conversationId);
    }
  };

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    unreadCount,
    sendMessage,
    markAsRead,
    markAllAsRead,
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