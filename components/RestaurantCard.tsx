import React, { useState } from 'react';
import { Star, Clock } from 'lucide-react';
import { Restaurant } from '../types';
import { Link } from 'react-router-dom';

interface Props {
  data: Restaurant;
}

const RestaurantCard: React.FC<Props> = ({ data }) => {
  const [imageSrc, setImageSrc] = useState(data.image);

  return (
    <Link to={`/restaurant/${data.id}`} className="group block h-full">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-float transition-all duration-300 ease-out h-full flex flex-col border border-transparent hover:border-gray-100 transform-gpu">
        {/* Image Container */}
        <div className="relative h-60 overflow-hidden bg-gray-100">
          {/* Skeleton Pulse - Lower z-index to avoid overlap glitch */}
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>
          
          <img 
            src={imageSrc} 
            alt={data.name} 
            className="w-full h-full object-cover relative z-10 transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform" 
            loading="lazy"
            onError={() => setImageSrc('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')}
            style={{ backfaceVisibility: 'hidden' }}
          />
          
          {/* Overlay Gradient - On top of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300 z-20"></div>
          
          {/* Offer Badge */}
          {data.offers.length > 0 && (
            <div className="absolute bottom-3 left-3 z-30 flex flex-col items-start gap-1">
                 <span className="text-white bg-brand-600/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {data.offers[0]}
                 </span>
            </div>
          )}
          
           {/* Delivery Time Badge (Top Right) */}
           <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1">
                <Clock size={12} className="text-brand-500" />
                {data.deliveryTime}
           </div>
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1 gap-2">
             <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-brand-600 transition-colors line-clamp-1">{data.name}</h3>
             <div className="flex items-center gap-1 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm shrink-0">
                <span>{data.rating}</span>
                <Star size={8} fill="currentColor" />
             </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mt-1 mb-3">
             <p className="truncate font-medium text-gray-500">{data.cuisine.join(', ')}</p>
             <span className="font-medium text-gray-700 shrink-0 ml-2">{data.priceForTwo}</span>
          </div>

          <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
             <div className="bg-purple-50 text-purple-600 p-1 rounded-full">
                <img src="https://cdn-icons-png.flaticon.com/512/6124/6124998.png" className="w-3 h-3" alt="Safety" />
             </div>
             <span>Max Safety Delivery</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;