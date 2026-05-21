import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-2xl bg-white shadow-sm mt-10">
      <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. Your order ID is <span className="font-bold text-gray-800">#{id}</span>
      </p>

      {order && (
        <div className="text-left border-t border-b py-6 mb-8">
          <h3 className="font-bold mb-4">Order Details</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount:</span>
              <span className="font-bold">₹{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping To:</span>
              <span className="font-bold ml-10 text-right">{order.shippingAddress}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Link to="/" className="bg-[#2874f0] text-white px-8 py-2.5 font-medium rounded-sm shadow-md">
          Continue Shopping
        </Link>
        <Link to="/orders" className="border border-gray-300 text-gray-700 px-8 py-2.5 font-medium rounded-sm hover:bg-gray-50 transition-colors">
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
