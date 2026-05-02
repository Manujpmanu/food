import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { DeliveryAddressProvider } from './context/DeliveryAddressContext';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

const App: React.FC = () => {
  return (
    <CartProvider>
      <DeliveryAddressProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Router>
      </DeliveryAddressProvider>
    </CartProvider>
  );
};

export default App;
