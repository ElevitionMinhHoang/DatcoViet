export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: 'customer' | 'staff' | 'admin';
  avatar?: string;
  createdAt: Date;
  isActive?: boolean;
  totalSpent?: number;
  orderCount?: number;
  lastOrderDate?: Date;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  unit: string;
  isAvailable: boolean;
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  preparationTime?: number;
  tags?: string[];
}

export interface FeastSet {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  dishes: { dish: Dish; quantity: number }[];
  servings: number;
  category: string;
  isPopular: boolean;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  tags?: string[];
}

export interface CartItem {
  id: string;
  type: 'dish' | 'set';
  item: Dish | FeastSet;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  deliveryDate: Date;
  deliveryAddress: string;
  totalAmount: number;
  depositAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  notes: string;
  staffNotes?: string;
  assignedStaffId?: string;
  statusHistory: StatusHistory[];
  createdAt: Date;
  updatedAt: Date;
  cancelReason?: string;
  invoiceId?: string;
}

export interface StatusHistory {
  status: Order['status'];
  updatedBy: string;
  updatedAt: Date;
  notes?: string;
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: string;
  createdAt: Date;
  approvedAt?: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: User['role'];
  toUserId: string;
  toUserName: string;
  toUserRole: User['role'];
  content: string;
  messageType: 'text' | 'image' | 'system';
  images?: string[];
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: {
    userId: string;
    userName: string;
    userRole: User['role'];
    lastReadAt?: Date;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  orderId?: string;
  status: 'active' | 'resolved' | 'archived';
  tags?: string[];
}

export interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  unreadCount: number;
  sendMessage: (conversationId: string, content: string, messageType?: 'text' | 'image') => Promise<void>;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantIds: string[], orderId?: string) => string;
  setActiveConversation: (conversationId: string | null) => void;
  isLoading: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_status' | 'new_message' | 'review_approved' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string; // orderId, messageId, etc.
  createdAt: Date;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: Date;
  paidAt?: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  newCustomers: number;
  pendingOrders: number;
  unreadMessages: number;
  pendingReviews: number;
}