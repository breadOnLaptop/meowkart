import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';

const Checkout: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const [address, setAddress] = useState({
    name: 'Default User',
    phone: '9876543210',
    pincode: '400001',
    locality: 'Fort',
    address: '123, Meow Street',
    city: 'Mumbai',
    state: 'Maharashtra',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Summary
  const navigate = useNavigate();

  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const fullAddress = `${address.name}, ${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}. Phone: ${address.phone}`;
      const response = await axios.post('http://localhost:5000/api/orders', {
        shippingAddress: fullAddress,
      });
      clearCart();
      navigate(`/order-success/${response.data.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

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
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="border p-3 rounded-sm focus:outline-blue-600 text-sm" 
                  value={address.name}
                  onChange={(e) => setAddress({...address, name: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="10-digit mobile number" 
                  className="border p-3 rounded-sm focus:outline-blue-600 text-sm" 
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Pincode" 
                  className="border p-3 rounded-sm focus:outline-blue-600 text-sm" 
                  value={address.pincode}
                  onChange={(e) => setAddress({...address, pincode: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Locality" 
                  className="border p-3 rounded-sm focus:outline-blue-600 text-sm" 
                  value={address.locality}
                  onChange={(e) => setAddress({...address, locality: e.target.value})}
                  required
                />
              </div>
              <textarea 
                placeholder="Address (Area and Street)" 
                className="w-full border p-3 rounded-sm focus:outline-blue-600 mb-4 h-24 text-sm"
                value={address.address}
                onChange={(e) => setAddress({...address, address: e.target.value})}
                required
              />
              <button 
                type="submit" 
                className="bg-[#fb641b] text-white px-10 py-3.5 font-bold rounded-sm shadow-md uppercase tracking-wider text-sm"
              >
                Deliver Here
              </button>
            </form>
          )}
          {step > 1 && (
            <div className="p-4 text-sm font-medium">
               {address.name}, {address.address}, {address.city} - {address.pincode}
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
                  <p className="text-sm">Order confirmation email will be sent to <b>{address.name}</b></p>
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
