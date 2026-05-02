import React, { useState } from 'react';
import { RESTAURANTS, MENU_ITEMS } from '../constants';
import RestaurantCard from '../components/RestaurantCard';
import FoodItemCard from '../components/FoodItemCard';
import { Search, X, Sparkles, Loader2, TrendingUp, ChevronRight, MapPin } from 'lucide-react';
import Header from '../components/Header';
import { getFoodRecommendations } from '../services/groqService';
import { MenuItem, Restaurant } from '../types';
import { useNavigate } from 'react-router-dom';
import { useDeliveryAddress } from '../context/DeliveryAddressContext';

const Home: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [restaurantResults, setRestaurantResults] = useState<Restaurant[]>([]);
  const [searchMode, setSearchMode] = useState<'normal' | 'ai'>('normal');
  const navigate = useNavigate();
    const { deliveryAddress } = useDeliveryAddress();

  const handleSearch = async (e: React.FormEvent | string) => {
    const query = typeof e === 'string' ? e : searchQuery;
    if (typeof e !== 'string') e.preventDefault();
    
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchQuery(query); // Update input if called via chips
    
    if (searchMode === 'ai') {
        const { recommendedItemIds, nearbyRestaurantIds } = await getFoodRecommendations(query, deliveryAddress);
        const items = MENU_ITEMS.filter(item => recommendedItemIds.includes(item.id));
        const nearbyRestaurants = RESTAURANTS.filter(restaurant => nearbyRestaurantIds.includes(restaurant.id));
        setRecommendations(items);
        setRestaurantResults(nearbyRestaurants);
    } else {
        // Simple client side filter
        const lower = query.toLowerCase();
        
        // Filter Restaurants
        const matchedRestaurants = RESTAURANTS.filter(r => 
            r.name.toLowerCase().includes(lower) || 
            r.cuisine.some(c => c.toLowerCase().includes(lower))
        );
        setRestaurantResults(matchedRestaurants);

        // Filter Menu Items
        const matchedItems = MENU_ITEMS.filter(item => 
            item.name.toLowerCase().includes(lower) || 
            item.description.toLowerCase().includes(lower) ||
            item.category.toLowerCase().includes(lower)
        );
        setRecommendations(matchedItems);
    }
    
    setIsSearching(false);
  };

  const trendingCuisines = ['Biryani', 'Pizza', 'Burger', 'Sushi', 'Healthy', 'Cake', 'Thali'];

  return (
    <div className="min-h-screen bg-[#f8f8f8] pb-20">
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      {/* Hero / Offers Section */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-6">
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative min-h-[340px] flex items-center group">
             {/* Background Image with Overlay */}
             <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                    alt="Food Background"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s] ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
             </div>

             <div className="relative z-10 p-8 md:p-14 max-w-2xl">
                <span className="inline-block bg-gold-500 text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-5 shadow-lg shadow-gold-500/20">
                    Premium Dining
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                    Taste the <span className="text-brand-500">Difference</span>
                </h1>
                <p className="text-gray-300 text-lg mb-8 max-w-lg font-medium leading-relaxed">
                    Order from the finest restaurants with our gold standard delivery service. Experience culinary excellence at your doorstep.
                </p>
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-brand-600/40 flex items-center gap-2"
                >
                    Explore Now <ChevronRight size={18} />
                </button>
             </div>
        </div>

        {/* Featured Restaurants Grid */}
        <div id="restaurants" className="mt-16">
            <div className="flex items-end justify-between mb-8">
                 <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Collections</h2>
                    <p className="text-gray-500 mt-2 text-lg">Explore curated lists of top restaurants, cafes, pubs, and bars in your city, based on trends</p>
                 </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {RESTAURANTS.map(restaurant => (
                    <RestaurantCard key={restaurant.id} data={restaurant} />
                ))}
            </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-4 sm:pt-20 px-4 transition-all duration-300">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
                    <button onClick={() => setIsSearchOpen(false)} className="md:hidden p-2 text-gray-500"><X /></button>
                    <Search className="text-brand-500 hidden md:block" />
                    <form onSubmit={(e) => handleSearch(e)} className="flex-1">
                        <input 
                            autoFocus
                            type="text" 
                            placeholder={searchMode === 'ai' ? "Ask AI: 'Spicy food for a cold rainy day'" : "Search for restaurants or dishes..."}
                            className="w-full text-lg outline-none text-gray-700 placeholder:text-gray-400 font-medium h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                        <div className="bg-gray-200 rounded-full p-1"><X size={16} className="text-gray-600" /></div>
                    </button>
                </div>
                
                {/* Search Mode Toggle */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    <button 
                        onClick={() => { setSearchMode('normal'); setRecommendations([]); setRestaurantResults([]); setSearchQuery(''); }}
                        className={`flex-1 py-3 text-sm font-bold transition-all relative ${searchMode === 'normal' ? 'text-brand-600 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                    >
                        Standard Search
                        {searchMode === 'normal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"></div>}
                    </button>
                    <button 
                        onClick={() => { setSearchMode('ai'); setRecommendations([]); setRestaurantResults([]); setSearchQuery(''); }}
                        className={`flex-1 py-3 text-sm font-bold transition-all relative flex items-center justify-center gap-2 ${searchMode === 'ai' ? 'text-purple-600 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                    >
                        <Sparkles size={16} />
                        AI Search
                        {searchMode === 'ai' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 scroll-smooth">
                    {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <Loader2 className="animate-spin mb-3 text-brand-500" size={32} />
                            <p className="font-medium">Searching best matches...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {(restaurantResults.length > 0 || recommendations.length > 0) ? (
                                <div className="animate-in fade-in duration-300 space-y-8">
                                    
                                    {/* Restaurant Results */}
                                    {restaurantResults.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Nearby Restaurants</h3>
                                            <div className="space-y-3">
                                                {restaurantResults.map(restaurant => (
                                                    <div 
                                                        key={restaurant.id}
                                                        onClick={() => { navigate(`/restaurant/${restaurant.id}`); setIsSearchOpen(false); }}
                                                        className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                                    >
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-800 truncate">{restaurant.name}</h4>
                                                            <p className="text-xs text-gray-500 truncate">{restaurant.cuisine.join(', ')}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{restaurant.rating} ★</span>
                                                                <span className="text-[10px] text-gray-400">• {restaurant.deliveryTime}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={16} className="text-gray-300" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Menu Item Results */}
                                    {recommendations.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Matching Dishes</h3>
                                            <div className="space-y-3">
                                                {recommendations.map(item => (
                                                    <FoodItemCard key={item.id} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : searchQuery ? (
                                <div className="text-center text-gray-500 py-16">
                                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                                        <Search size={24} className="opacity-50" />
                                    </div>
                                    <p className="font-medium">No matches found for "{searchQuery}"</p>
                                    <p className="text-sm mt-1">Try checking your spelling or use general terms.</p>
                                </div>
                            ) : (
                                <div className="py-6 px-2">
                                    {searchMode === 'ai' ? (
                                        <div className="text-center space-y-6">
                                             <div className="inline-block p-4 bg-purple-50 text-purple-600 rounded-full mb-2 ring-4 ring-purple-50/50">
                                                <Sparkles size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-xl">AI Assistant is ready</h3>
                                                <p className="text-gray-500 mt-2 max-w-sm mx-auto">Tell me what you're craving, and I’ll suggest dishes plus nearby restaurants based on your saved address.</p>
                                            </div>
                                            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                                                <button onClick={() => handleSearch("Healthy lunch options")} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors shadow-sm">"Healthy lunch"</button>
                                                <button onClick={() => handleSearch("Sweet desserts under ₹200")} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors shadow-sm">"Sweet desserts"</button>
                                                <button onClick={() => handleSearch("Spicy dinner for two")} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors shadow-sm">"Spicy dinner"</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <TrendingUp size={18} className="text-brand-500" />
                                                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Popular Cuisines</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {trendingCuisines.map(cuisine => (
                                                    <button 
                                                        key={cuisine}
                                                        onClick={() => handleSearch(cuisine)}
                                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all active:scale-95 shadow-sm"
                                                    >
                                                        {cuisine}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;