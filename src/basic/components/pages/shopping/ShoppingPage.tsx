import React from 'react';
import { ProductList } from './product';
import { CartSidebar } from './cart';

interface ShoppingPageProps {
  products: any[];
  filteredProducts: any[];
  cart: any[];
  coupons: any[];
  selectedCoupon: any;
  totals: any;
  searchTerm: string;
  isAdmin: boolean;
  onAddToCart: (product: any) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onApplyCoupon: (coupon: any) => void;
  onClearSelectedCoupon: () => void;
  onCompleteOrder: () => void;
}

export const ShoppingPage: React.FC<ShoppingPageProps> = ({
  products,
  filteredProducts,
  cart,
  coupons,
  selectedCoupon,
  totals,
  searchTerm,
  isAdmin,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onApplyCoupon,
  onClearSelectedCoupon,
  onCompleteOrder,
}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          cart={cart}
          searchTerm={searchTerm}
          isAdmin={isAdmin}
          onAddToCart={onAddToCart}
        />
      </div>

      <div className='lg:col-span-1'>
        <CartSidebar
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          totals={totals}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveFromCart={onRemoveFromCart}
          onApplyCoupon={onApplyCoupon}
          onClearSelectedCoupon={onClearSelectedCoupon}
          onCompleteOrder={onCompleteOrder}
        />
      </div>
    </div>
  );
};
