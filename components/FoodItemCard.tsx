import React, { useState } from 'react';
import { Star, Plus, Minus, ThumbsUp } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  item: MenuItem;
}

const FoodItemCard: React.FC<Props> = ({ item }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = cartItems.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;
  const isBestseller = item.votes > 100 && item.rating > 4.5;
    const [imageSrc, setImageSrc] = useState(item.image);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-soft transition-all group">
      <div className="flex justify-between gap-4 sm:gap-8">
        {/* Text Section */}
        <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
                {/* Veg/Non-Veg Icon */}
                <span className={`w-4 h-4 border-2 flex items-center justify-center rounded-[4px] ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                </span>
                {isBestseller && (
                    <span className="bg-gold-400/20 text-gold-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Bestseller
                    </span>
                )}
            </div>
            
            <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
            <p className="font-bold text-gray-900 text-base">₹{item.price}</p>
            
            {item.rating > 0 && (
                 <div className="flex items-center gap-1 text-xs font-semibold text-gold-600 bg-gold-50 px-1.5 py-0.5 rounded w-fit border border-gold-100">
                    <Star size={10} fill="currentColor" />
                    <span>{item.rating}</span>
                    <span className="text-gray-400 font-normal">({item.votes})</span>
                 </div>
            )}

            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-2">{item.description}</p>
        </div>
        
        {/* Image & Action Section */}
        <div className="flex flex-col items-center justify-start w-32 sm:w-36 relative shrink-0">
            <div className="w-32 h-28 sm:w-36 sm:h-32 rounded-xl overflow-hidden shadow-sm relative">
                <img
                    src={imageSrc}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageSrc('https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')}
                />
            </div>
            
            {/* Add Button - Floating over image bottom */}
            <div className="relative -mt-6 shadow-lg bg-white rounded-lg w-24 sm:w-28 overflow-hidden border border-brand-100">
                {quantity === 0 ? (
                    <button 
                        onClick={() => addToCart(item)}
                        className="w-full py-2 text-brand-600 font-extrabold text-sm uppercase hover:bg-brand-50 transition-colors"
                    >
                        ADD
                    </button>
                ) : (
                    <div className="flex items-center justify-between bg-white h-9">
                        <button 
                            onClick={() => quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)} 
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-brand-600 hover:bg-gray-50"
                        >
                            <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="font-bold text-brand-600 text-sm">{quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-8 h-full flex items-center justify-center text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                        >
                            <Plus size={14} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Customizable</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;