import { ReactNode } from 'react';
import { NotificationProvider } from './NotificationContext';
import { ProductProvider } from './ProductContext';
import { CouponProvider } from './CouponContext';
import { CartProvider } from './CartContext';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <NotificationProvider>
      <ProductProvider>
        <CouponProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CouponProvider>
      </ProductProvider>
    </NotificationProvider>
  );
}