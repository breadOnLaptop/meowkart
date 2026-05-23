import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { useAddressStore } from '../store/useAddressStore';
import { Plus } from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Summary
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses]);

  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleAddressSelect = (id: number) => {
    setSelectedAddressId(id);
  };

  const handleNextStep = () => {
    if (!selectedAddressId) {
      alert('Please select or add a delivery address');
      return;
    }
    setStep(2);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/orders`, {
        addressId: selectedAddressId,
      });
      clearCart();
      navigate(`/order-success/${response.data.id}`);
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.error || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 max-w-[1248px] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4">
        {/* Step 1: Login (Assume Done) */}
        <div className="bg-white shadow-sm overflow-hidden rounded-sm">
          <div className="bg-white p-4 font-bold text-gray-400 flex gap-4 items-center uppercase text-sm">
            <span className="bg-gray-100 text-blue-600 rounded-sm px-2 py-0.5 text-[10px]">1</span>
            Login
            <span className="text-gray-900 ml-4 lowercase font-normal italic">Default User</span>
          </div>
        </div>

        {/* Step 2: Delivery Address */}
        <div className="bg-white shadow-sm overflow-hidden rounded-sm">
          <div className={`p-4 font-bold flex gap-4 items-center uppercase text-sm ${step === 1 ? 'bg-[#2874f0] text-white' : 'bg-white text-gray-400'}`}>
            <span className="bg-white text-blue-600 rounded-sm px-2 py-0.5 text-[10px]">2</span>
            Delivery Address
          </div>
          
          {step === 1 && (
            <div className="p-0">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  onClick={() => handleAddressSelect(addr.id)}
                  className={`p-6 border-b cursor-pointer flex gap-4 items-start transition-colors ${selectedAddressId === addr.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id ? 'border-blue-600' : 'border-gray-300'}`}>
                    {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-bold text-sm">{addr.name}</span>
                      <span className="font-bold text-sm">{addr.phone}</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                    </p>
                    {selectedAddressId === addr.id && (
                      <button 
                        onClick={handleNextStep}
                        className="mt-4 bg-[#fb641b] text-white px-10 py-3 font-bold rounded-sm shadow-md uppercase text-sm"
                      >
                        Deliver Here
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <div 
                onClick={() => navigate('/addresses')}
                className="p-6 flex items-center gap-4 text-blue-600 font-bold text-sm uppercase cursor-pointer hover:bg-gray-50"
              >
                <Plus size={18} />
                Add a new address
              </div>
            </div>
          )}
          {step > 1 && selectedAddress && (
            <div className="p-4 text-sm font-medium flex justify-between items-center">
               <span>{selectedAddress.name}, {selectedAddress.addressLine}, {selectedAddress.city} - {selectedAddress.pincode}</span>
               <button onClick={() => setStep(1)} className="text-blue-600 font-bold uppercase text-xs border px-4 py-2 rounded-sm shadow-sm">Change</button>
            </div>
          )}
        </div>

        {/* Step 3: Order Summary */}
        <div className="bg-white shadow-sm overflow-hidden rounded-sm">
          <div className={`p-4 font-bold flex gap-4 items-center uppercase text-sm ${step === 2 ? 'bg-[#2874f0] text-white' : 'bg-white text-gray-400'}`}>
            <span className="bg-white text-blue-600 rounded-sm px-2 py-0.5 text-[10px]">3</span>
            Order Summary
          </div>
          
          {step === 2 && (
            <div className="p-0">
               {items.map(item => (
                 <div key={item.id} className="p-4 border-b flex gap-4">
                    <img src={item.product.imageUrls[0]} alt="" className="w-16 h-16 object-contain border" />
                    <div>
                       <h4 className="text-sm font-medium">{item.product.name}</h4>
                       <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                       <p className="font-bold text-sm mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                 </div>
               ))}
               <div className="p-4 flex items-center justify-between">
                  <p className="text-sm">Order confirmation email will be sent to <b>{selectedAddress?.name}</b></p>
                  <button 
                    onClick={placeOrder}
                    disabled={loading}
                    className="bg-[#fb641b] text-white px-10 py-3.5 font-bold rounded-sm shadow-md uppercase tracking-wider text-sm disabled:bg-gray-400"
                  >
                    {loading ? 'Placing Order...' : 'Confirm Order'}
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Price Summary */}
      <div className="lg:w-[380px] h-fit">
        <div className="bg-white shadow-sm">
          <h2 className="p-4 border-b font-bold text-gray-500 uppercase text-sm tracking-wider">Price Details</h2>
          <div className="p-4 flex flex-col gap-5 border-b text-sm">
            <div className="flex justify-between">
              <span>Price ({items.length} items)</span>
              <span>₹{(totalAmount * 1.2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-₹{(totalAmount * 0.2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-bold uppercase">Free</span>
            </div>
          </div>
          <div className="p-4 flex justify-between font-bold text-lg">
            <span>Amount Payable</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
