import { CartItem as CartItemType, Coupon } from '../../../types';
import { calculateItemTotal } from '../../utils/calculations/cartCalculations';
import { BagIcon } from '../ui/Icons';
import CartItem from './CartItem';
import Checkout from './Checkout';
import CouponSelector from './CouponSelector';

interface CartProps {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon, cart: CartItemType[]) => void;
  onSelectedCouponChange: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
}

export default function Cart({
  cart,
  coupons,
  selectedCoupon,
  totals,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onSelectedCouponChange,
  onCompleteOrder,
}: CartProps) {
  return (
    <div className='lg:col-span-1'>
      <div className='sticky top-24 space-y-4'>
        <section className='bg-white rounded-lg border border-gray-200 p-4'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <BagIcon className='w-5 h-5 mr-2' strokeWidth={2} />
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className='text-center py-8'>
              <BagIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' strokeWidth={1} />
              <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {cart.map((item) => {
                const itemTotal = calculateItemTotal(item, cart);
                const originalPrice = item.product.price * item.quantity;
                const hasDiscount = itemTotal < originalPrice;
                const discountRate = hasDiscount
                  ? Math.round((1 - itemTotal / originalPrice) * 100)
                  : 0;

                return (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onRemoveFromCart={onRemoveFromCart}
                    onUpdateQuantity={onUpdateQuantity}
                    hasDiscount={hasDiscount}
                    discountRate={discountRate}
                    itemTotal={itemTotal}
                  />
                );
              })}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <CouponSelector
              coupons={coupons}
              cart={cart}
              selectedCoupon={selectedCoupon}
              onApplyCoupon={onApplyCoupon}
              onSelectedCouponChange={onSelectedCouponChange}
            />
            <Checkout totals={totals} onCompleteOrder={onCompleteOrder} />
          </>
        )}
      </div>
    </div>
  );
}
