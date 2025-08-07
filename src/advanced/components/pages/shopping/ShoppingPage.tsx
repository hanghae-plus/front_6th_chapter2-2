import React from 'react';
import { CartSidebar } from './cart';
import { ProductList } from './product';

interface ShoppingPageProps {
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onApplyCoupon: (coupon: any) => void;
  onClearSelectedCoupon: () => void;
  onCompleteOrder: () => void;
}

export const ShoppingPage: React.FC<ShoppingPageProps> = ({
  onUpdateQuantity,
  onRemoveFromCart,
  onApplyCoupon,
  onClearSelectedCoupon,
  onCompleteOrder,
}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductList />
      </div>

      <div className='lg:col-span-1'>
        <CartSidebar
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
