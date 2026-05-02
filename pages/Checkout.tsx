import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Wallet, Truck, Recycle, CheckCircle2, ChevronRight, Leaf } from 'lucide-react';
import { formatDeliveryAddress, useDeliveryAddress } from '../context/DeliveryAddressContext';

const Checkout: React.FC = () => {
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
    const { deliveryAddress, setDeliveryAddress } = useDeliveryAddress();
    const [isRecycleOptIn, setIsRecycleOptIn] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressDraft, setAddressDraft] = useState(deliveryAddress);
    const GREEN_PAY_URL = 'https://rebox-box.netlify.app/';

    useEffect(() => {
        setAddressDraft(deliveryAddress);
    }, [deliveryAddress]);

  const DELIVERY_FEE = 49;
  const TAX_RATE = 0.05;
  const tax = cartTotal * TAX_RATE;
  const finalTotal = cartTotal + tax + DELIVERY_FEE;

    const handlePlaceOrder = () => {
        if (paymentMethod === 'green-pay') {
            if (typeof window !== 'undefined') {
                window.location.href = GREEN_PAY_URL;
            }
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsOrderPlaced(true);
            setIsLoading(false);
            clearCart();
        }, 2000);
    };

    const handleSaveAddress = () => {
        const nextAddress = addressDraft.trim();
        if (!nextAddress) return;

        setDeliveryAddress(nextAddress);
        setIsEditingAddress(false);
    };

    const handleCancelAddressEdit = () => {
        setAddressDraft(deliveryAddress);
        setIsEditingAddress(false);
    };

    const addressLines = deliveryAddress.split('\n').map(line => line.trim()).filter(Boolean);
    const primaryAddressLine = addressLines[0] ?? 'Home';
    const secondaryAddressLines = addressLines.slice(1);

  if (isOrderPlaced) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 border-4 border-brand-200 rounded-full animate-ping opacity-20"></div>
                <CheckCircle2 className="text-brand-600 w-12 h-12" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Payment Successful</h1>
            <p className="text-gray-500 mb-2 max-w-xs mx-auto">Your food is being prepared and will be with you shortly.</p>
            
            {isRecycleOptIn && (
                 <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3 text-left max-w-sm mx-auto">
                    <Recycle className="text-green-600 shrink-0 mt-1" size={20} />
                    <div>
                        <p className="text-green-800 font-bold text-sm">You're an Eco Hero!</p>
                        <p className="text-green-700 text-xs mt-1">Thank you for opting to recycle. Please keep your cardboard boxes ready for the delivery partner.</p>
                    </div>
                 </div>
            )}
            
            <button 
                onClick={() => navigate('/')}
                className="mt-10 bg-brand-500 text-white px-10 py-3.5 rounded-full font-bold shadow-lg hover:bg-brand-600 transition-all"
            >
                Back to Home
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,112,67,0.14),_transparent_34%),linear-gradient(180deg,_#fff8f5_0%,_#f6f7fb_100%)] pb-36">
        <div className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl shadow-sm px-4 py-4">
            <div className="max-w-6xl mx-auto flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm">
                    <ArrowLeft className="text-gray-700" />
                </button>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-500">Secure payment</p>
                    <h1 className="font-extrabold text-2xl text-gray-900">Checkout</h1>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-[minmax(0,1.1fr)_360px] gap-6 lg:gap-8 items-start">
            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-950 via-gray-900 to-brand-700 text-white shadow-2xl border border-white/10">
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.4),_transparent_38%)]"></div>
                    <div className="relative p-7 sm:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        <div className="max-w-xl">
                            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] bg-white/10 px-3 py-1 rounded-full mb-4">
                                <Leaf size={12} /> Fast, flexible checkout
                            </p>
                            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">Finish your order without breaking the flow.</h2>
                            <p className="mt-4 text-white/75 max-w-lg text-sm sm:text-base leading-relaxed">Your address, payment choice, and eco option are all in one place, with a cleaner summary below.</p>
                        </div>
                        <div className="shrink-0 rounded-[1.5rem] bg-white/10 border border-white/15 p-5 sm:p-6 backdrop-blur-md min-w-[220px]">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-white/70 font-bold">Amount due</p>
                            <div className="mt-2 text-4xl font-black">₹{finalTotal.toFixed(0)}</div>
                            <p className="mt-2 text-xs text-white/65">Includes delivery fee and tax.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-[2rem] p-6 sm:p-7 shadow-xl border border-white/70">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Delivery Address</h3>
                        <button
                            onClick={() => setIsEditingAddress(true)}
                            className="text-brand-600 font-bold text-sm hover:underline"
                        >
                            Change
                        </button>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-50 border border-brand-100 p-3 rounded-full shrink-0 shadow-sm">
                            <MapPin size={24} className="text-brand-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-base">{primaryAddressLine}</h4>
                            {!isEditingAddress ? (
                                <div className="mt-1 text-gray-500 text-sm leading-relaxed">
                                    {secondaryAddressLines.length > 0 ? (
                                        secondaryAddressLines.map(line => (
                                            <p key={line}>{line}</p>
                                        ))
                                    ) : (
                                        <p>{formatDeliveryAddress(deliveryAddress)}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-3 space-y-3">
                                    <textarea
                                        value={addressDraft}
                                        onChange={(e) => setAddressDraft(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none"
                                        placeholder="Enter your delivery address"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={handleSaveAddress}
                                            className="bg-brand-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-brand-600 transition-colors"
                                        >
                                            Save Address
                                        </button>
                                        <button
                                            onClick={handleCancelAddressEdit}
                                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-[2rem] p-6 sm:p-7 shadow-xl border border-white/70">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Payment Method</h3>
                    <div className="space-y-3">
                        <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-brand-600 w-5 h-5" />
                            <div className="bg-gray-100 p-2 rounded-lg">
                                 <CreditCard size={20} className="text-gray-700" />
                            </div>
                            <span className="font-medium text-gray-700 flex-1">Credit / Debit Card</span>
                        </label>
                        <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-brand-600 w-5 h-5" />
                             <div className="bg-gray-100 p-2 rounded-lg">
                                 <Wallet size={20} className="text-gray-700" />
                            </div>
                            <span className="font-medium text-gray-700 flex-1">UPI</span>
                        </label>
                        <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-brand-600 w-5 h-5" />
                            <div className="bg-gray-100 p-2 rounded-lg">
                                 <Truck size={20} className="text-gray-700" />
                            </div>
                            <span className="font-medium text-gray-700 flex-1">Cash on Delivery</span>
                        </label>
                        <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'green-pay' ? 'border-green-500 bg-green-50 ring-1 ring-green-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="payment" value="green-pay" checked={paymentMethod === 'green-pay'} onChange={() => setPaymentMethod('green-pay')} className="accent-green-600 w-5 h-5" />
                            <div className="bg-green-100 p-2 rounded-lg">
                                 <Leaf size={20} className="text-green-700" />
                            </div>
                            <div className="flex-1">
                                <span className="font-semibold text-gray-800">Green Pay</span>
                                <p className="text-xs text-gray-500 mt-0.5">Redirects you to our recycle rewards portal.</p>
                            </div>
                            <span className="text-[10px] font-bold text-green-700 uppercase">New</span>
                        </label>
                    </div>
                </div>

                <div className={`p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden ${isRecycleOptIn ? 'bg-gradient-to-br from-green-50 to-white border-green-500 shadow-xl' : 'bg-white/90 backdrop-blur border-gray-200 shadow-xl'}`}>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className={`p-3 rounded-full shrink-0 transition-colors ${isRecycleOptIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                            <Recycle size={28} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                                 <h3 className="font-bold text-gray-900 text-lg">Green Delivery</h3>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isRecycleOptIn} 
                                        onChange={(e) => setIsRecycleOptIn(e.target.checked)}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            <p className="text-gray-600 font-medium mt-1">Delivery agent will take cardboard or any other recyclable boxes.</p>
                            <p className={`text-sm mt-3 transition-colors leading-relaxed ${isRecycleOptIn ? 'text-green-700' : 'text-gray-500'}`}>
                                Help recycle! Hand over unused cardboard or boxes to the delivery agent.
                            </p>
                        </div>
                    </div>
                    {isRecycleOptIn && <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-30"></div>}
                </div>
            </div>

            <aside className="hidden lg:block sticky top-24">
                <div className="rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white/70 shadow-2xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                        <p className="text-[10px] uppercase tracking-[0.24em] font-bold text-white/75">Order summary</p>
                        <div className="mt-3 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-white/75 text-sm">Paying now</p>
                                <p className="text-4xl font-black">₹{finalTotal.toFixed(0)}</p>
                            </div>
                            <div className="text-right text-xs text-white/75">
                                <p>Delivery fee</p>
                                <p className="font-bold text-white">₹{DELIVERY_FEE}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-gray-900">₹{cartTotal.toFixed(0)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span className="font-semibold text-gray-900">₹{tax.toFixed(0)}</span></div>
                        <div className="flex justify-between"><span>Delivery</span><span className="font-semibold text-gray-900">₹{DELIVERY_FEE}</span></div>
                        <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between text-base"><span className="font-bold text-gray-900">Total</span><span className="font-black text-gray-900">₹{finalTotal.toFixed(0)}</span></div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                            className="w-full mt-2 bg-gray-950 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Processing...' : <>Place Order <ChevronRight size={20} /></>}
                        </button>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] uppercase tracking-[0.16em] font-bold text-gray-400">
                            <div className="rounded-xl bg-gray-50 p-3 text-center">Secure checkout</div>
                            <div className="rounded-xl bg-gray-50 p-3 text-center">Fast dispatch</div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <div className="fixed lg:hidden bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 p-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                 <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wide">Total to Pay</span>
                    <span className="text-2xl font-extrabold text-gray-900">₹{finalTotal.toFixed(0)}</span>
                 </div>
                 <button 
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 bg-brand-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-brand-600 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Processing...' : (
                        <>
                            Place Order <ChevronRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
};

export default Checkout;