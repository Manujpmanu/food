import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'tomatoez_delivery_address';
const DEFAULT_ADDRESS = 'Home\n123 Green Street, Eco City, 90210\nApartment 4B';

type DeliveryAddressContextValue = {
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
};

const DeliveryAddressContext = createContext<DeliveryAddressContextValue | undefined>(undefined);

const getInitialAddress = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_ADDRESS;
  }

  const storedAddress = window.localStorage.getItem(STORAGE_KEY);
  return storedAddress && storedAddress.trim() ? storedAddress : DEFAULT_ADDRESS;
};

export const formatDeliveryAddress = (address: string) =>
  address
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(', ');

export const DeliveryAddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deliveryAddress, setDeliveryAddress] = useState(getInitialAddress);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, deliveryAddress);
    }
  }, [deliveryAddress]);

  return (
    <DeliveryAddressContext.Provider value={{ deliveryAddress, setDeliveryAddress }}>
      {children}
    </DeliveryAddressContext.Provider>
  );
};

export const useDeliveryAddress = () => {
  const context = useContext(DeliveryAddressContext);

  if (!context) {
    throw new Error('useDeliveryAddress must be used within a DeliveryAddressProvider');
  }

  return context;
};