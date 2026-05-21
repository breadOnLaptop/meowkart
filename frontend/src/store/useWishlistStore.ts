import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

interface WishlistItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrls: string[];
  };
}

interface WishlistStore {
  items: WishlistItem[];
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  fetchWishlist: async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist`);
      set({ items: response.data.items || [] });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  },
  toggleWishlist: async (productId) => {
    const { items, fetchWishlist } = get();
    const existingItem = items.find((item) => item.productId === productId);

    try {
      if (existingItem) {
        await axios.delete(`${API_URL}/wishlist/item/${existingItem.id}`);
      } else {
        await axios.post(`${API_URL}/wishlist`, { productId });
      }
      await fetchWishlist();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  },
  isInWishlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
}));
