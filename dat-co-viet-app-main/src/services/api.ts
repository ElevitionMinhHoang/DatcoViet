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
    return data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description || `${item.name} - Món ăn truyền thống Việt Nam`,
      image: item.image || '/images/placeholder.svg',
      price: item.price,
      category: item.category,
      unit: 'phần',
      isAvailable: item.isActive !== false,
      ingredients: [],
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 30,
      tags: [],
    }));
  },

  getMenuById: async (id: string): Promise<Dish> => {
    const data = await apiRequest(`/menus/${id}`);
    return {
      id: data.id.toString(),
      name: data.name,
      description: data.description || `${data.name} - Món ăn truyền thống Việt Nam`,
      image: data.image || '/images/placeholder.svg',
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
  }) => {
    return await apiRequest('/menus', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
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

  approveFeedback: async (id: number): Promise<any> => {
    return await apiRequest(`/feedback/${id}/approve`, {
      method: 'PATCH',
    });
  },

  rejectFeedback: async (id: number): Promise<any> => {
    return await apiRequest(`/feedback/${id}/reject`, {
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
    
    return feastSets.map(menu => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      image: menu.image,
      price: menu.price,
      dishes: [],
      servings: 4,
      category: menu.category,
      isPopular: true,
      rating: 4.8,
      reviewCount: 124,
      isActive: menu.isAvailable,
      tags: ['Truyền thống', 'Ấm cúng'],
    }));
  },

  getFeastSetById: async (id: string): Promise<FeastSet> => {
    // Get menu item by ID and convert to feast set format
    const menuItem = await menusAPI.getMenuById(id);
    
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
      rating: 4.8,
      reviewCount: 124,
      isActive: menuItem.isAvailable,
      tags: ['Truyền thống', 'Ấm cúng'],
    };
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
};