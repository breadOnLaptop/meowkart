import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Download } from 'lucide-react';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setCancelling(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/orders/${id}/cancel`);
      alert('Order cancelled successfully. Stock has been restored.');
      await fetchOrder();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Order Details...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 max-w-[1248px]">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight size={12} />
        <Link to="/orders" className="hover:text-blue-600">My Orders</Link>
        <ChevronRight size={12} />
        <span className="font-bold text-gray-800">Order ID: #{order.id}</span>
      </div>

      <div className="bg-white shadow-sm border rounded-sm mb-4">
         <div className="p-6 border-b flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
               <h2 className="font-bold text-sm mb-4">Delivery Address</h2>
               <p className="text-sm font-bold text-gray-800 mb-1">Default User</p>
               <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                 {order.shippingAddress || '123, Meow Street, Cat City, 400001, India'}
               </p>
               <p className="text-sm font-bold text-gray-800 mt-3">Phone number</p>
               <p className="text-sm text-gray-600">9876543210</p>
            </div>

            <div className="md:w-72">
               <h2 className="font-bold text-sm mb-4">More Actions</h2>
               <div className="flex flex-col gap-4">
                  <button className="flex items-center gap-3 text-sm font-bold text-gray-800 hover:text-blue-600 border px-4 py-2 rounded-sm w-fit shadow-sm">
                     <Download size={16} className="text-blue-600" />
                     Download Invoice
                  </button>
                  {['PENDING', 'PROCESSING'].includes(order.status) && (
                    <button 
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="text-sm font-bold text-red-600 hover:bg-red-50 border border-red-100 px-4 py-2 rounded-sm w-fit disabled:opacity-50"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white shadow-sm border rounded-sm mb-4 overflow-hidden">
         <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {order.status}
            </span>
         </div>
         {order.items.map((item: any) => (
            <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6 border-b last:border-b-0">
               <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border p-1">
                  <img 
                    src={item.product.imageUrls[0]} 
                    alt={item.product.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Order+Item';
                    }}
                  />
               </div>
               
               <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate block mb-1">
                     {item.product.name}
                  </Link>
                  <p className="text-xs text-gray-500 mb-2">Seller: Meow Retail</p>
                  <p className="text-sm font-bold">₹{item.price.toLocaleString()}</p>
               </div>

               <div className="md:w-64">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                     <span className="text-sm font-bold text-gray-800">Delivered</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-4.5">Your item has been delivered</p>
               </div>
            </div>
         ))}
      </div>

      <div className="bg-white shadow-sm border rounded-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="text-sm">
            <p className="text-gray-500 mb-1">Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p className="font-bold text-lg">Total Amount: ₹{order.totalAmount.toLocaleString()}</p>
         </div>
         <div className="flex gap-4">
            <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">Help Center</Link>
         </div>
      </div>
    </div>
  );
};

export default OrderDetail;
