import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import { useCartStore } from './store/useCartStore';
import { useWishlistStore } from './store/useWishlistStore';

function App() {
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, [fetchCart, fetchWishlist]);

  return (
    <Router basename="/meowkart">
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
        <footer className="bg-[#172337] text-white py-10 mt-10">
          <div className="container mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs max-w-[1248px]">
            <div>
              <h4 className="text-gray-500 uppercase mb-4 font-bold">About</h4>
              <ul className="flex flex-col gap-2">
                <li className="hover:underline cursor-pointer">Contact Us</li>
                <li className="hover:underline cursor-pointer">About Us</li>
                <li className="hover:underline cursor-pointer">Careers</li>
                <li className="hover:underline cursor-pointer">Meowkart Stories</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-500 uppercase mb-4 font-bold">Help</h4>
              <ul className="flex flex-col gap-2">
                <li className="hover:underline cursor-pointer">Payments</li>
                <li className="hover:underline cursor-pointer">Shipping</li>
                <li className="hover:underline cursor-pointer">Cancellation & Returns</li>
                <li className="hover:underline cursor-pointer">FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-500 uppercase mb-4 font-bold">Policy</h4>
              <ul className="flex flex-col gap-2">
                <li className="hover:underline cursor-pointer">Return Policy</li>
                <li className="hover:underline cursor-pointer">Terms Of Use</li>
                <li className="hover:underline cursor-pointer">Security</li>
                <li className="hover:underline cursor-pointer">Privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-500 uppercase mb-4 font-bold">Social</h4>
              <ul className="flex flex-col gap-2">
                <li className="hover:underline cursor-pointer">Facebook</li>
                <li className="hover:underline cursor-pointer">Twitter</li>
                <li className="hover:underline cursor-pointer">YouTube</li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-10 mt-10 pt-10 border-t border-gray-700 text-center text-[10px] text-gray-400">
            <p>&copy; 2026 Meowkart.com - Flipkart Clone Project SDE Assignment</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
