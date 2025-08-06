import React from "react";
import { AdminProvider } from "./AdminContext";
import { SearchProvider } from "./SearchContext";
import { CouponSelectionProvider } from "./CouponSelectionContext";
import { NotificationProvider } from "./NotificationContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { CouponProvider } from "./CouponContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AdminProvider>
      <SearchProvider>
        <CouponSelectionProvider>
          <NotificationProvider>
            <ProductProvider>
              <CartProvider>
                <CouponProvider>{children}</CouponProvider>
              </CartProvider>
            </ProductProvider>
          </NotificationProvider>
        </CouponSelectionProvider>
      </SearchProvider>
    </AdminProvider>
  );
};
