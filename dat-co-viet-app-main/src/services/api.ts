import { User, Dish, FeastSet, Order, Review } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Common headers for API requests
const getHeaders = (includeAuth = true) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request handler
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getHeaders(!endpoint.includes('/auth/')),
    ...options.headers,
  };
  
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  console.log('Headers:', headers);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      // Try to parse error response from backend
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log('Error details:', errorData);
      } catch {
        // If response is not JSON, use default error message
        const errorText = await response.text();
        console.log('Error response text:', errorText);
      }
      // If unauthorized (401), clear token and user
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optionally redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('API Success:', result);
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    return data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  forgotPassword: async (email: string) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  },
};

// Users API
export const usersAPI = {
  getProfile: async (): Promise<User> => {
    return await apiRequest('/users/me');
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    return await apiRequest('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },
};

// Admin API
export const adminAPI = {
  // Users management
  getUsers: async (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return await apiRequest(`/users/admin${query}`);
  },

  getUserDetails: async (id: number) => {
    return await apiRequest(`/users/${id}`);
  },

  getUserStats: async () => {
    return await apiRequest('/users/admin/stats');
  },

  // Orders management
  getOrders: async (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return await apiRequest(`/orders/staff${query}`);
  },

  getOrderStats: async () => {
    return await apiRequest('/orders/admin/stats');
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    return await apiRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getPaymentStats: async () => {
    return await apiRequest('/payments/admin/stats');
  },
};

// Menus API
export const menusAPI = {
  getAllMenus: async (): Promise<Dish[]> => {
    const data = await apiRequest('/menus');
    return data.map((item: any) => {
      // Construct full image URL if it's a relative path
      let imageUrl = item.image || '/images/placeholder.svg';
      if (imageUrl.startsWith('/uploads/')) {
        imageUrl = `${API_BASE_URL.replace('/api/v1', '')}${imageUrl}`;
      }
      
      return {
        id: item.id.toString(),
        name: item.name,
        description: item.description || `${item.name} - Món ăn truyền thống Việt Nam`,
        image: imageUrl,
        price: item.price,
        category: item.category,
        unit: 'phần',
        isAvailable: item.isActive !== false,
        ingredients: [],
        isVegetarian: false,
        isSpicy: false,
        preparationTime: 30,
        tags: [],
      };
    });
  },

  getMenuById: async (id: string): Promise<Dish> => {
    const data = await apiRequest(`/menus/${id}`);
    
    // Construct full image URL if it's a relative path
    let imageUrl = data.image || '/images/placeholder.svg';
    if (imageUrl.startsWith('/uploads/')) {
      imageUrl = `${API_BASE_URL.replace('/api/v1', '')}${imageUrl}`;
    }
    
    return {
      id: data.id.toString(),
      name: data.name,
      description: data.description || `${data.name} - Món ăn truyền thống Việt Nam`,
      image: imageUrl,
      price: data.price,
      category: data.category,
      unit: 'phần',
      isAvailable: data.isActive !== false,
      ingredients: [],
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 30,
      tags: [],
    };
  },

  createMenuItem: async (menuData: {
    name: string;
    price: number;
    category: string;
    image: string;
    isActive: boolean;
    imageFile?: File;
  }) => {
    if (menuData.imageFile) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', menuData.name);
      formData.append('price', menuData.price.toString());
      formData.append('category', menuData.category);
      formData.append('isActive', menuData.isActive.toString());
      formData.append('image', menuData.imageFile);
      
      const url = `${API_BASE_URL}/menus`;
      const token = localStorage.getItem('token');
      
      console.log(`API Request: POST ${url} (multipart/form-data)`);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            const errorText = await response.text();
            console.log('Error response text:', errorText);
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('API Success:', result);
        return result;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    } else {
      // Use JSON for regular data
      return await apiRequest('/menus', {
        method: 'POST',
        body: JSON.stringify(menuData),
      });
    }
  },

  updateMenuItem: async (id: string, menuData: {
    name?: string;
    price?: number;
    category?: string;
    image?: string;
    isActive?: boolean;
  }) => {
    return await apiRequest(`/menus/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(menuData),
    });
  },
};

// Orders API
export const ordersAPI = {
  createOrder: async (orderData: {
    items: Array<{
      menuId: number;
      quantity: number;
    }>;
  }): Promise<any> => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async (): Promise<any[]> => {
    const data = await apiRequest('/orders/my-orders');
    return data.map((order: any) => ({
      id: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status,
      items: order.items.map((item: any) => ({
        id: item.id,
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.price,
        menu: item.menu,
      })),
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    }));
  },

  getOrderById: async (id: string): Promise<any> => {
    return await apiRequest(`/orders/${id}`);
  },

  confirmOrder: async (id: string): Promise<any> => {
    return await apiRequest(`/orders/${id}/confirm`, {
      method: 'PATCH',
    });
  },

  cancelOrder: async (id: string): Promise<any> => {
    return await apiRequest(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  },
};

// Feedback API
export const feedbackAPI = {
  createFeedback: async (feedbackData: {
    orderId: string;
    rating: number;
    comment: string;
    images?: string[];
  }): Promise<Review> => {
    return await apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  getFeedback: async (): Promise<Review[]> => {
    const data = await apiRequest('/feedback');
    return data.map((review: any) => ({
      id: review.id,
      orderId: review.orderId,
      customerId: review.customerId,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
      status: review.status,
      createdAt: new Date(review.createdAt),
      approvedAt: review.approvedAt ? new Date(review.approvedAt) : undefined,
      dishName: review.dishName,
    }));
  },

  getAllFeedback: async (): Promise<any[]> => {
    const data = await apiRequest('/feedback');
    return data.map((feedback: any) => ({
      id: feedback.id,
      orderId: feedback.orderId,
      rating: feedback.rating,
      comment: feedback.comment,
      isApproved: feedback.isApproved || false,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  },

  getFeedbackByOrder: async (orderId: string): Promise<Review> => {
    const data = await apiRequest(`/feedback/order/${orderId}`);
    return {
      id: data.id,
      orderId: data.orderId,
      customerId: data.customerId,
      customerName: data.customerName,
      rating: data.rating,
      comment: data.comment,
      images: data.images || [],
      status: data.status,
      createdAt: new Date(data.createdAt),
      approvedAt: data.approvedAt ? new Date(data.approvedAt) : undefined,
    };
  },

  getFeedbackByMenu: async (menuId: string): Promise<Review[]> => {
    const data = await apiRequest(`/feedback/menu/${menuId}`);
    return data.map((review: any) => ({
      id: review.id,
      orderId: review.orderId,
      customerId: review.customerId,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
      status: review.isApproved ? 'approved' : 'pending',
      createdAt: new Date(review.createdAt),
      updatedAt: new Date(review.updatedAt),
    }));
  },

  deleteFeedback: async (id: number): Promise<any> => {
    return await apiRequest(`/feedback/${id}`, {
      method: 'PATCH',
    });
  },
};

// Feast Sets API - now using real backend data
export const feastSetsAPI = {
  getAllFeastSets: async (): Promise<FeastSet[]> => {
    // Get all menus and filter for feast sets (category = "Mâm Cỗ")
    const allMenus = await menusAPI.getAllMenus();
    const feastSets = allMenus.filter(menu => menu.category === 'Mâm Cỗ');

    // Fetch reviews for each feast set in parallel
    const feastSetsWithReviews = await Promise.all(
      feastSets.map(async (menu) => {
        try {
          const reviews = await feedbackAPI.getFeedbackByMenu(menu.id);
          const reviewCount = reviews.length;
          const rating = reviewCount > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0;
          return {
            id: menu.id,
            name: menu.name,
            description: menu.description,
            image: menu.image,
            price: menu.price,
            dishes: [],
            servings: 4,
            category: menu.category,
            isPopular: true,
            rating: parseFloat(rating.toFixed(1)), // round to 1 decimal
            reviewCount,
            isActive: menu.isAvailable,
            tags: ['Truyền thống', 'Ấm cúng'],
          };
        } catch (error) {
          console.error(`Failed to fetch reviews for menu ${menu.id}:`, error);
          // Fallback to default values
          return {
            id: menu.id,
            name: menu.name,
            description: menu.description,
            image: menu.image,
            price: menu.price,
            dishes: [],
            servings: 4,
            category: menu.category,
            isPopular: true,
            rating: 0,
            reviewCount: 0,
            isActive: menu.isAvailable,
            tags: ['Truyền thống', 'Ấm cúng'],
          };
        }
      })
    );

    return feastSetsWithReviews;
  },

  getFeastSetById: async (id: string): Promise<FeastSet> => {
    // Get menu item by ID and convert to feast set format
    const menuItem = await menusAPI.getMenuById(id);
    
    try {
      const reviews = await feedbackAPI.getFeedbackByMenu(id);
      const reviewCount = reviews.length;
      const rating = reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
      
      return {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        image: menuItem.image,
        price: menuItem.price,
        dishes: [],
        servings: 4,
        category: menuItem.category,
        isPopular: true,
        rating: parseFloat(rating.toFixed(1)),
        reviewCount,
        isActive: menuItem.isAvailable,
        tags: ['Truyền thống', 'Ấm cúng'],
      };
    } catch (error) {
      console.error(`Failed to fetch reviews for menu ${id}:`, error);
      // Fallback
      return {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        image: menuItem.image,
        price: menuItem.price,
        dishes: [],
        servings: 4,
        category: menuItem.category,
        isPopular: true,
        rating: 0,
        reviewCount: 0,
        isActive: menuItem.isAvailable,
        tags: ['Truyền thống', 'Ấm cúng'],
      };
    }
  },
};

// Payments API
export const paymentsAPI = {
  createPayment: async (paymentData: {
    orderId: number;
    method: string;
    amount: number;
  }): Promise<any> => {
    return await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  getPaymentByOrder: async (orderId: number): Promise<any> => {
    return await apiRequest(`/payments/order/${orderId}`);
  },

  refundPayment: async (paymentId: number): Promise<any> => {
    return await apiRequest(`/payments/${paymentId}/refund`, {
      method: 'PATCH',
    });
  },
};

// Chat API
export const chatAPI = {
  // Get or create user chat room
  getOrCreateChatRoom: async () => {
    return await apiRequest('/chat/room');
  },

  // Get all chat rooms (for admin)
  getChatRooms: async () => {
    return await apiRequest('/chat/rooms');
  },

  // Get messages for a chat room
  getChatRoomMessages: async (roomId: number) => {
    return await apiRequest(`/chat/room/${roomId}/messages`);
  },

  // Send a message
  sendMessage: async (messageData: {
    roomId: number;
    message: string;
  }) => {
    return await apiRequest('/chat/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Mark messages as read
  markMessagesAsRead: async (roomId: number) => {
    return await apiRequest(`/chat/room/${roomId}/read`, {
      method: 'POST',
    });
  },

  // Get unread message count
  getUnreadCount: async () => {
    return await apiRequest('/chat/unread-count');
  },

  // Close chat room
  closeChatRoom: async (roomId: number) => {
    return await apiRequest(`/chat/room/${roomId}/close`, {
      method: 'POST',
    });
  },
};

// Contact API
export const contactAPI = {
  submitContact: async (contactData: {
    name: string;
    email: string;
    message: string;
  }) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

export default {
  auth: authAPI,
  users: usersAPI,
  menus: menusAPI,
  orders: ordersAPI,
  feedback: feedbackAPI,
  feastSets: feastSetsAPI,
  admin: adminAPI,
  payments: paymentsAPI,
  contact: contactAPI,
  chat: chatAPI,
};