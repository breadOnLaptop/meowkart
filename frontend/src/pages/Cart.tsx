import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const Cart: React.FC = () => {
  const { items, fetchCart, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center bg-white shadow-sm mt-4 max-w-[1248px]">
        <img 
          src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80" 
          alt="Empty Cart" 
          className="mx-auto w-64 mb-6" 
        />
        <h2 className="text-xl font-medium mb-2">Your cart is empty!</h2>
        <p className="text-gray-500 mb-6">Add items to it now.</p>
        <Link to="/" className="bg-[#2874f0] text-white px-12 py-2.5 font-medium rounded-sm shadow-md">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 flex flex-col lg:flex-row gap-6 max-w-[1248px]">
      {/* Left: Cart Items */}
      <div className="flex-1 bg-white shadow-sm h-fit">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">My Cart ({items.length})</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Deliver to:</span>
            <span className="font-bold">Default User, 400001</span>
          </div>
        </div>

        {items.map((item) => (
          <div key={item.id} className="p-6 border-b flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
               <div className="w-28 h-28 flex items-center justify-center flex-shrink-0 border p-2">
                 <img src={item.product.imageUrls[0]} alt={item.product.name} className="max-w-full max-h-full object-contain" />
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-10 text-center border py-0.5 rounded-sm text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={12} />
                  </button>
                </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-800 line-clamp-1 mb-1">
                {item.product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2 font-bold">Seller: Meow Retail</p>
              
              <div className="flex items-center gap-3 mb-4 mt-4">
                <span className="text-xl font-bold">₹{item.product.price.toLocaleString()}</span>
                <span className="text-gray-400 line-through text-sm">₹{(item.product.price * 1.2).toLocaleString()}</span>
                <span className="text-green-600 font-bold text-sm">20% Off</span>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-sm font-bold uppercase hover:text-blue-600 flex items-center gap-1"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="hidden md:block text-sm text-gray-600">
               Delivery by Tomorrow, Fri | <span className="text-green-600">Free</span>
            </div>
          </div>
        ))}

        <div className="p-6 flex justify-end sticky bottom-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-[#fb641b] text-white px-16 py-4 font-bold rounded-sm shadow-md uppercase tracking-wider text-sm"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Right: Price Summary */}
      <div className="lg:w-[380px] sticky top-20 h-fit">
        <div className="bg-white shadow-sm">
          <h2 className="p-4 border-b font-bold text-gray-500 uppercase text-sm tracking-wider">Price Details</h2>
          <div className="p-4 flex flex-col gap-5 border-b text-sm">
            <div className="flex justify-between">
              <span>Price ({totalItems} items)</span>
              <span>₹{(totalAmount * 1.2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-₹{(totalAmount * 0.2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
          </div>
          <div className="p-4 flex justify-between font-bold text-lg border-b border-dashed">
            <span>Total Amount</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>
          <p className="p-4 text-green-600 font-bold text-sm">
            You will save ₹{(totalAmount * 0.2).toLocaleString()} on this order
          </p>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs px-4 font-bold">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.png" alt="" className="w-8" />
          <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
