import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronDown, Package, Heart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { user } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${searchQuery}`);
  };

  return (
    <header className="bg-[#2874f0] text-white sticky top-0 z-50 py-3 shadow-md">
      <div className="container mx-auto px-4 md:px-10 flex items-center justify-between max-w-[1248px]">
        <div className="flex items-center gap-10 flex-1">
          <Link to="/" className="flex flex-col">
            <img 
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" 
              alt="Meowkart" 
              className="h-5 w-auto" 
            />
            <span className="italic text-[10px] flex items-center text-yellow-300">
              Explore <span className="font-bold text-yellow-300 ml-0.5">Plus</span>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/plus_aef861.png" alt="plus" className="h-2.5 ml-0.5" />
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full py-2 px-4 pr-10 text-gray-800 focus:outline-none rounded-sm text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-2 text-blue-600">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-6 md:gap-10 ml-4">
          <div 
            className="relative cursor-pointer"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <div className="flex items-center gap-1 font-medium bg-white text-blue-600 px-6 py-1 rounded-sm">
              {user?.name}
              <ChevronDown size={14} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>
            
            {showUserMenu && (
              <>
                {/* Transparent bridge to prevent menu from closing when moving mouse */}
                <div className="absolute top-full left-0 w-full h-2"></div>
                <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-white text-gray-800 shadow-2xl rounded-sm py-2 border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-sm font-medium">
                    <Package size={18} className="text-blue-600" /> My Orders
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-sm font-medium">
                    <Heart size={18} className="text-blue-600" /> Wishlist
                  </Link>
                  <Link to="/addresses" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-sm font-medium">
                    <MapPin size={18} className="text-blue-600" /> My Addresses
                  </Link>
                </div>
                {/* Arrow indicator */}
                <div className="absolute top-full right-10 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white z-50"></div>
              </>
            )}
          </div>
          
          <button className="hidden md:block font-medium text-sm">Become a Seller</button>

          <Link to="/cart" className="flex items-center gap-2 relative">
            <ShoppingCart size={20} />
            <span className="hidden md:block font-medium text-sm">Cart</span>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-white font-bold">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
