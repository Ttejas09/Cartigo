import { MapPin, Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';


export function Header() {
  const { itemCount } = useCart();

  return (
    // CHANGED: bg-slate-900 gives a premium, "dark mode" aesthetic
    <header className="sticky top-0 z-50 bg-slate-900 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <img
            src={logo}
            alt="Cartigo Logo"
            className="h-16 w-auto transition-transform group-hover:scale-105"
          />
          <span className="text-2xl font-bold tracking-wide">
            <span className="text-white">Cart</span>
            <span className="text-indigo-400">igo</span>
          </span>
        </Link>


        {/* Search Section */}
        <div className="flex-1 max-w-2xl relative mx-4 hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[0_0_10px_rgba(255,255,255,0.1)] text-slate-800 placeholder-gray-400"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          {/* Location Icon - Light Gray on Dark Bg */}
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-gray-300 hover:text-white">
            <MapPin className="w-6 h-6" />
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 hover:bg-slate-800 rounded-full transition-colors group">
            <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-white" />
            
            {/* Badge - Red pop looks great on dark bg */}
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-slate-900">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-2 bg-white rounded-full focus:outline-none shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}