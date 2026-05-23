import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/orders`);
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleTimeChange = (time: string) => {
    setTimeFilters(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const filteredOrders = orders.filter(order => {
    // 1. Search Query Filter
    const matchesSearch = order.id.toString().includes(searchQuery) || 
      order.items.some((item: any) => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    // 2. Status Filter
    if (statusFilters.length > 0) {
      // Mapping static filter names to DB status
      const statusMap: Record<string, string> = {
        'On the way': 'SHIPPED',
        'Delivered': 'DELIVERED',
        'Cancelled': 'CANCELLED',
        'Processing': 'PROCESSING'
      };
      const activeDbStatuses = statusFilters.map(f => statusMap[f]).filter(Boolean);
      if (activeDbStatuses.length > 0 && !activeDbStatuses.includes(order.status)) return false;
    }

    // 3. Time Filter
    if (timeFilters.length > 0) {
      const orderDate = new Date(order.createdAt);
      const isMatch = timeFilters.some(filter => {
        if (filter === 'Last 30 days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return orderDate >= thirtyDaysAgo;
        }
        if (filter === '2026') return orderDate.getFullYear() === 2026;
        if (filter === '2025') return orderDate.getFullYear() === 2025;
        if (filter === 'Older') return orderDate.getFullYear() < 2025;
        return true;
      });
      if (!isMatch) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 md:px-10 py-4 max-w-[1248px] flex flex-col lg:flex-row gap-4">
        
        {/* Left Sidebar Filters (Static for fidelity) */}
        <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
          <div className="bg-white shadow-sm border rounded-sm h-fit">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">Filters</h2>
            </div>
            
            <div className="p-4 border-b">
              <h3 className="font-bold text-xs uppercase text-gray-500 mb-3">Order Status</h3>
              <div className="flex flex-col gap-2">
                {['On the way', 'Delivered', 'Cancelled', 'Processing'].map(status => (
                  <label key={status} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4" 
                      checked={statusFilters.includes(status)}
                      onChange={() => handleStatusChange(status)}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-xs uppercase text-gray-500 mb-3">Order Time</h3>
              <div className="flex flex-col gap-2">
                {['Last 30 days', '2026', '2025', 'Older'].map(time => (
                  <label key={time} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4" 
                      checked={timeFilters.includes(time)}
                      onChange={() => handleTimeChange(time)}
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content: Orders List */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Search Bar */}
          <div className="bg-white p-2 shadow-sm border rounded-sm flex items-center gap-2">
             <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Search your orders here"
                  className="w-full py-2 px-4 pr-10 text-sm focus:outline-none border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <button className="bg-blue-600 text-white px-6 py-2 rounded-sm text-sm font-bold flex items-center gap-2">
                <Search size={16} />
                Search Orders
             </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white p-16 text-center shadow-sm border rounded-sm">
               <img 
                 src="https://images.unsplash.com/photo-1629084592238-d6043bb08a20?auto=format&fit=crop&w=800&q=80" 
                 alt="No Orders" 
                 className="mx-auto w-64 mb-6"
                 onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Orders+Yet';
                 }}
               />
               <h3 className="text-xl font-medium mb-2">You have no orders yet!</h3>
               <p className="text-gray-500 mb-6">Looks like you haven't made your choice yet.</p>
               <Link to="/" className="bg-blue-600 text-white px-10 py-2.5 rounded-sm font-bold shadow-md">
                  Shop Now
               </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white shadow-sm border rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Each order can have multiple items, Flipkart shows them as separate rows or grouped. 
                      Let's show each item in the order as a row to perfectly match the detail level. */}
                  {order.items.map((item: any, idx: number) => (
                    <Link 
                      to={`/order/${order.id}`} 
                      key={item.id} 
                      className={`p-6 flex flex-col md:flex-row gap-6 items-start md:items-center ${idx < order.items.length - 1 ? 'border-b' : ''}`}
                    >
                      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border p-1 rounded-sm">
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
                         <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate mb-1">
                            {item.product.name}
                         </h3>
                         <p className="text-xs text-gray-500 mb-1">Seller: Meow Retail</p>
                         <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                               Order ID: #{order.id}
                            </span>
                         </div>
                      </div>

                      <div className="md:w-32">
                         <p className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                         <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Qty: {item.quantity}</p>
                      </div>

                      <div className="md:w-56">
                         <div className="flex items-center gap-2 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                            <span className="text-sm font-bold text-gray-800">Delivered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                         </div>
                         <p className="text-[10px] text-gray-500 ml-4.5">Your item has been delivered</p>
                         
                         <div className="flex items-center gap-1 mt-3 text-blue-600 text-xs font-bold hover:underline ml-4.5 cursor-pointer">
                            <Package size={14} />
                            <span>Rate & Review Product</span>
                         </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
