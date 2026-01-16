import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  storeName?: string;
}

export function ProductCard({ id, name, price, originalPrice, image, storeName }: ProductCardProps) {
  const { addItem } = useCart();
  
  // Calculate discount percentage if original price exists
  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Link to={`/product/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {storeName && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border border-white/50">
              {storeName}
            </span>
          )}
        </div>

        {/* Side Action Buttons (Wishlist/View) - Slide in from right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-out">
          <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* "Quick Add" Button - Slides up from bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/50 to-transparent">
          <button 
            onClick={() => addItem({ id, name, price, image, quantity: 1, storeId: storeName || 'default' })}
            className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-gray-800 text-lg mb-1 truncate group-hover:text-indigo-600 transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}