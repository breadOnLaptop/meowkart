import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Zap, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrls: string[];
  category: string;
  description: string;
  specifications: Record<string, string>;
  stock: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      await addItem(product.id);
      navigate('/cart');
    }
  };

  const handleWishlist = async () => {
    if (product) {
      await toggleWishlist(product.id);
    }
  };

  const nextImage = () => {
    if (product) {
      setActiveImage((prev) => (prev + 1) % product.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setActiveImage((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-blue-600 font-bold">Loading Product Details...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-10 py-4 flex flex-col md:flex-row gap-8 max-w-[1248px]">
        {/* Left: Images and Buttons */}
        <div className="md:w-[40%] md:sticky md:top-20 h-fit">
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-16">
              {product.imageUrls.map((url, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setActiveImage(idx)}
                  className={`border p-1 h-16 cursor-pointer ${activeImage === idx ? 'border-blue-600' : 'border-gray-200 hover:border-blue-600'}`}
                >
                  <img src={url} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>

            {/* Main Image Carousel */}
            <div className="flex-1 border border-gray-100 p-4 relative group h-[450px] flex items-center justify-center bg-white">
              <button 
                onClick={handleWishlist}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md border hover:bg-gray-50 transition-colors"
              >
                <Heart 
                  size={20} 
                  className={isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-300"} 
                />
              </button>
              
              <img 
                src={product.imageUrls[activeImage]} 
                alt={product.name} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x800?text=Product+Image';
                }}
                className="max-h-full max-w-full object-contain" 
              />

              {product.imageUrls.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-4 shadow-lg rounded-r-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={24} className="text-gray-600" />
                  </button>
                  <button onClick={nextImage} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-4 shadow-lg rounded-l-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={24} className="text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#ff9f00] text-white py-4 px-2 rounded-sm font-bold flex items-center justify-center gap-2 uppercase shadow-sm text-sm"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button 
              onClick={handleAddToCart} 
              className="flex-1 bg-[#fb641b] text-white py-4 px-2 rounded-sm font-bold flex items-center justify-center gap-2 uppercase shadow-sm text-sm"
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:w-[60%]">
          <nav className="text-[10px] text-gray-500 mb-2 font-medium flex items-center gap-1">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight size={10} />
            <Link to={`/?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link>
            <ChevronRight size={10} />
            <span className="text-gray-400 truncate max-w-[250px]">{product.name}</span>
          </nav>
          <h1 className="text-lg font-medium mb-1 text-gray-800">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
              4.4 <Star size={10} fill="white" />
            </span>
            <span className="text-gray-500 text-xs font-bold">1,245 Ratings & 156 Reviews</span>
            <img 
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
              alt="Assured" 
              className="h-5 ml-2" 
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-gray-500 line-through text-sm">₹{(product.price * 1.2).toLocaleString()}</span>
            <span className="text-green-600 font-bold text-sm">20% off</span>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-sm mb-3">Available offers</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 text-sm items-start">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/offertag_7ad544.png" alt="" className="w-4 h-4 mt-0.5" />
                <span><span className="font-bold">Bank Offer</span> 5% Unlimited Cashback on Meowkart Bank Credit Card <span className="text-blue-600 font-bold">T&C</span></span>
              </div>
              <div className="flex gap-2 text-sm items-start">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/offertag_7ad544.png" alt="" className="w-4 h-4 mt-0.5" />
                <span><span className="font-bold">Special Price</span> Get extra ₹3000 off (price inclusive of cashback/coupon) <span className="text-blue-600 font-bold">T&C</span></span>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-sm mb-6 overflow-hidden">
            <h3 className="font-bold text-lg p-4 bg-gray-50 border-b">Product Description</h3>
            <div className="p-4">
               <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-sm overflow-hidden">
            <h3 className="font-bold text-lg p-4 bg-gray-50 border-b">Specifications</h3>
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="py-3 text-gray-500 w-1/3">{key}</td>
                      <td className="py-3 text-gray-800 font-medium">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
