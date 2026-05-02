import React from 'react';
import { ShoppingBag, Search, Sparkles, MapPin, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatDeliveryAddress, useDeliveryAddress } from '../context/DeliveryAddressContext';

interface HeaderProps {
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const { itemCount } = useCart();
  const location = useLocation();
  const { deliveryAddress } = useDeliveryAddress();
  const addressSummary = formatDeliveryAddress(deliveryAddress);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
                <span className="font-extrabold text-4xl italic tracking-tighter text-brand-600">tomatoez</span>
            </Link>

            {/* Location Selector Placeholder (Desktop) */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 cursor-pointer transition-colors border-l border-gray-200 pl-6 h-8">
                <MapPin size={20} className="text-brand-500" fill="currentColor" fillOpacity={0.2} />
                <div className="flex flex-col leading-none justify-center">
                    <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">Delivering to</span>
                  <span className="truncate max-w-[240px] text-gray-600 font-medium">{addressSummary}</span>
                </div>
                <ChevronDown size={14} />
            </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6">
          {location.pathname === '/' && (
            <button 
                onClick={onSearchClick}
                className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all px-4 py-2.5 rounded-full text-gray-500 w-10 h-10 sm:w-auto sm:h-auto justify-center sm:justify-start"
            >
                <Search size={18} className="text-brand-500" />
                <span className="hidden sm:inline font-medium text-sm text-gray-400">Search "Biryani"</span>
                <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-gray-300 text-brand-600 text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={12} /> AI
                </div>
            </button>
          )}

          <Link to="/cart" className="relative p-2.5 text-gray-700 hover:text-brand-600 transition-all">
            <ShoppingBag size={26} strokeWidth={2} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-0 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
          
          <div className="hidden sm:block w-10 h-10 bg-gray-100 rounded-full overflow-hidden cursor-pointer border border-gray-200 hover:border-brand-500 transition-all">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;