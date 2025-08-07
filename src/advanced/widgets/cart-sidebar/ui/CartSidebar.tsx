import { CartItemList } from './CartItemList';
import { CouponSelector } from './CouponSelector';
import { PaymentSummary } from './PaymentSummary';
import { calculateCartTotal } from '../../../entities/cart';
import { ProductWithUI } from '../../../entities/product';
import { useCouponApplyService } from '../../../features/cart-coupon';
import { useCartService } from '../../../features/cart-management';
import { usePaymentService } from '../../../features/payment';
import { Icon } from '../../../shared/icon';

interface CartSidebarProps {
  products: ProductWithUI[];
}

export function CartSidebar({ products }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, resetCart } = useCartService({ products });
  const { selectedCoupon, onApplyCoupon, resetSelectedCoupon } = useCouponApplyService();
  const { completeOrder } = usePaymentService();

  const totals = calculateCartTotal(cart, selectedCoupon);

  const handleCompleteOrder = () => {
    completeOrder(selectedCoupon);
    resetCart();
    resetSelectedCoupon();
  };

  return (
    <div className='lg:col-span-1'>
      <div className='sticky top-24 space-y-4'>
        <section className='bg-white rounded-lg border border-gray-200 p-4'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <Icon name='cartBagRegular' width={20} height={20} className='mr-2' />
            장바구니
          </h2>

          <CartItemList
            cart={cart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
        </section>

        {cart.length > 0 && (
          <>
            <CouponSelector onApplyCoupon={(coupon) => onApplyCoupon(cart, coupon)} />

            <PaymentSummary totals={totals} completeOrder={handleCompleteOrder} />
          </>
        )}
      </div>
    </div>
  );
}
