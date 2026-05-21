import React, { useEffect } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

const Wishlist: React.FC = () => {
  const { items, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const moveToCart = async (productId: number) => {
    await addItem(productId);
    alert('Added to cart!');
  };

  const removeFromWishlist = async (productId: number) => {
    await toggleWishlist(productId);
  };

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 max-w-[1248px]">
      <div className="bg-white shadow-sm rounded-sm min-h-[400px]">
        <div className="p-4 border-b">
           <h1 className="text-lg font-bold flex items-center gap-2">
              <Heart className="text-blue-600 fill-blue-600" size={20} />
              My Wishlist ({items.length})
           </h1>
        </div>
        
        {items.length === 0 ? (
          <div className="p-20 text-center">
             <img 
               src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" 
               alt="Empty Wishlist" 
               className="mx-auto w-64 mb-6" 
             />
             <p className="text-gray-500 text-lg">Empty Wishlist</p>
             <p className="text-gray-400 text-sm mt-1">Make a wish!</p>
             <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-10 py-2.5 rounded-sm font-bold shadow-md">
                Continue Shopping
             </Link>
          </div>
        ) : (
          <div>
            {items.map((item: any) => (
              <div key={item.id} className="p-6 border-b flex flex-col md:flex-row gap-6 items-center hover:bg-gray-50 transition-colors">
                 <div className="w-24 h-24 flex-shrink-0">
                    <img src={item.product.imageUrls[0]} alt="" className="w-full h-full object-contain" />
                 </div>
                 <div className="flex-1">
                    <Link to={`/product/${item.product.id}`} className="text-lg font-medium text-gray-800 line-clamp-1 hover:text-blue-600">
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-2 my-2">
                      <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
                        4.4 ★
                      </span>
                      <span className="text-gray-500 text-xs font-bold">(2,345)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">₹{item.product.price.toLocaleString()}</span>
                      <span className="text-gray-400 line-through text-sm">₹{(item.product.price * 1.2).toLocaleString()}</span>
                      <span className="text-green-600 font-bold text-sm">20% Off</span>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button 
                       onClick={() => moveToCart(item.product.id)}
                       className="bg-[#fb641b] text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase shadow-sm flex items-center gap-2"
                    >
                       <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.productId)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                       <Trash2 size={20} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
