import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrls: string[];
    category: string;
  };
}

interface CartStore {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  fetchCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      set({ items: response.data.items || [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  },
  addItem: async (productId, quantity = 1) => {
    try {
      await axios.post(`${API_URL}/cart`, { productId, quantity });
      get().fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },
  updateQuantity: async (itemId, quantity) => {
    try {
      await axios.put(`${API_URL}/cart/item/${itemId}`, { quantity });
      get().fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },
  removeItem: async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/item/${itemId}`);
      get().fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
  clearCart: () => set({ items: [] }),
}));
