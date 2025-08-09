import { ReactNode } from 'react';
import { NotificationProvider } from './notification-context';
import { ProductProvider } from './product-context';
import { CouponProvider } from './coupon-context';
import { CartProvider } from './cart-context';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <NotificationProvider>
      <ProductProvider>
        <CouponProvider>
          <CartProvider>{children}</CartProvider>
        </CouponProvider>
      </ProductProvider>
    </NotificationProvider>
  );
}
