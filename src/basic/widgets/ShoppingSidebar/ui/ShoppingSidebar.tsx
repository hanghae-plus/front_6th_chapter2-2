import { useMemo } from 'react';
import { CartItem, Coupon } from '../../../../types';
import { ProductWithUI } from '../../../entities/product';
import { useCart } from '../../../features/cart/hooks';
import { calculateCartTotal } from '../../../entities/cart';
import { CartItemsList } from '../../../features/cart/ui';
import { CouponSelector } from '../../../features/coupon/shop/ui';
import { OrderSummary } from '../../../features/order/ui';

interface ShoppingSidebarProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  products: ProductWithUI[];
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
  calculateCartTotalWithCoupon: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

export function ShoppingSidebar({
  cart,
  setCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  products,
  addNotification,
  calculateCartTotalWithCoupon,
}: ShoppingSidebarProps) {
  const { removeFromCart, updateQuantity } = useCart({
    cart,
    setCart,
    products,
    addNotification,
  });

  const totals = useMemo(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  return (
    <div className='sticky top-24 space-y-4'>
      {/* 장바구니 아이템 섹션 */}
      <CartItemsList
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      {/* 쿠폰 + 주문 섹션 */}
      {cart.length > 0 && (
        <>
          <CouponSelector
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            calculateCartTotalWithCoupon={calculateCartTotalWithCoupon}
          />
          <OrderSummary
            totals={totals}
            setCart={setCart}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
          />
        </>
      )}
    </div>
  );
}
