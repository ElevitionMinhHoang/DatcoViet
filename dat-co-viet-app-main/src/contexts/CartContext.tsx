import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dish, FeastSet, CartItem } from '@/types';

// A product can be either a single dish or a feast set
export type Product = Dish | FeastSet;

// Define the shape of the CartContext
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // Define valid menu IDs from backend (individual dishes 10-36 + feast sets 37-41)
        const validMenuIds = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41'];
        
        // Filter out invalid items (items with IDs not in validMenuIds)
        const validCartItems = parsedCart.filter((item: CartItem) => {
          const menuId = item.item.id;
          const isValid = validMenuIds.includes(menuId);
          if (!isValid) {
            console.log(`Removing invalid cart item: ${item.item.name} (ID: ${item.item.id})`);
          }
          return isValid;
        });

        if (validCartItems.length !== parsedCart.length) {
          console.log(`Cleaned cart: removed ${parsedCart.length - validCartItems.length} invalid items`);
          // Save cleaned cart back to localStorage
          localStorage.setItem('cart', JSON.stringify(validCartItems));
        }
        
        setCartItems(validCartItems);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    console.log('Adding to cart:', { product, quantity, productId: product.id, productIdType: typeof product.id });
    
    setCartItems(prevItems => {
      console.log('Previous cart items:', prevItems);
      console.log('Looking for existing item with ID:', product.id);
      
      const existingItem = prevItems.find(item => {
        const match = item.id === product.id;
        console.log(`Comparing: item.id=${item.id} (${typeof item.id}) vs product.id=${product.id} (${typeof product.id}) - Match: ${match}`);
        return match;
      });
      
      if (existingItem) {
        console.log('Found existing item, updating quantity:', existingItem);
        // If item exists, update its quantity
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        console.log('No existing item found, adding new item');
        // If item doesn't exist, add it to the cart
        const newCartItem: CartItem = {
          id: product.id,
          type: 'type' in product && product.type === 'set' ? 'set' : 'dish',
          item: product,
          quantity,
        };
        console.log('New cart item:', newCartItem);
        const newItems = [...prevItems, newCartItem];
        console.log('Updated cart items:', newItems);
        return newItems;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => {
    const itemPrice = item.item.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Create a custom hook for easy access to the context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
