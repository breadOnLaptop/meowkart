import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrls: string[];
  category: string;
  description: string;
}

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams] = useSearchParams();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  // Intersection Observer for Infinite Scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 1.0 });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/products`, {
          params: { search, category, page, limit: 12 }
        });
        
        const newProducts = response.data.products;
        
        setProducts(prev => {
          if (page === 1) return newProducts;
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newProducts.filter((p: Product) => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
        
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const categories = ['All', 'Mobiles', 'Electronics', 'Fashion', 'Home'];

  const handleWishlist = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productId);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow-sm border-b mb-4">
        <div className="container mx-auto px-4 md:px-10 max-w-[1248px] flex overflow-x-auto no-scrollbar justify-start md:justify-between py-3 gap-6 md:gap-0">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={cat === 'All' ? '/' : `/?category=${cat}`}
              className={`flex flex-col items-center gap-1 group min-w-fit ${category === cat ? 'text-blue-600' : ''}`}
            >
              <span className={`text-sm font-medium ${category === cat ? 'text-blue-600' : 'text-gray-800'} group-hover:text-blue-600`}>
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 py-2 flex gap-4 max-w-[1248px]">
        <aside className="w-60 bg-white shadow-sm h-fit sticky top-20 hidden md:block">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Filters</h2>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-xs text-gray-500 uppercase mb-4">Categories</h3>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={cat === 'All' ? '/' : `/?category=${cat}`}
                  className={`text-sm ${category === cat ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-white shadow-sm">
          <div className="p-4 border-b">
            <h1 className="text-lg font-medium">
              {category === 'All' ? 'Showing All Products' : `Showing results for "${category}"`}
              {search && ` & "${search}"`}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-h-[800px]">
            {products.map((product, index) => {
              const isLastElement = products.length === index + 1;
              return (
                <Link 
                  to={`/product/${product.id}`} 
                  key={`${product.id}-${index}`} 
                  ref={isLastElement ? lastProductRef : null}
                  className="group p-4 border-b border-r hover:shadow-2xl transition-shadow relative flex flex-col h-full min-h-[350px]"
                >
                  <button 
                    onClick={(e) => handleWishlist(e, product.id)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-300"} 
                    />
                  </button>

                  <div className="h-48 flex items-center justify-center mb-4 p-2 bg-white">
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.name} 
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Product+Image';
                      }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
                        4.4 ★
                      </span>
                      <span className="text-gray-500 text-xs font-medium">(2,345)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                      <img 
                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                        alt="Assured" 
                        className="h-4" 
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="p-10 flex flex-col items-center justify-center min-h-[150px]">
            {loading && (
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-sm font-medium">Loading more products...</span>
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <div className="text-center text-gray-500 text-sm border-t w-full pt-10">
                <p>You've reached the end of the catalog.</p>
              </div>
            )}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20 bg-white">
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="No results" className="mx-auto mb-4 w-60" />
              <h3 className="text-xl font-medium">Sorry, no results found!</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
