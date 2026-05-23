import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

interface Address {
  id: number;
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  addressLine: string;
  city: string;
  state: string;
  isDefault: boolean;
}

interface AddressStore {
  addresses: Address[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: number, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],
  loading: false,
  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/addresses`);
      set({ addresses: response.data });
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      set({ loading: false });
    }
  },
  addAddress: async (address) => {
    try {
      await axios.post(`${API_URL}/addresses`, address);
      await get().fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  },
  updateAddress: async (id, address) => {
    try {
      await axios.put(`${API_URL}/addresses/${id}`, address);
      await get().fetchAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  },
  deleteAddress: async (id) => {
    try {
      await axios.delete(`${API_URL}/addresses/${id}`);
      await get().fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  },
}));
