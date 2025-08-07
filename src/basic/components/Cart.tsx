// src/basic/components/Cart.tsx
import { useCart } from '../hooks/useCart';
import { useCoupons } from '../hooks/useCoupons';
import { CartItemCard } from './CartItemCard';
import { CartSummary } from './CartSummary';

interface Props {
  onCheckout: () => void;
}

export const Cart = ({ onCheckout }: Props) => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    applyCoupon, 
    selectedCoupon, 
    cartTotal,
    clearCart
  } = useCart();
  const { coupons } = useCoupons();

  const handleCheckout = () => {
    onCheckout();
    clearCart();
  }

  return (
    <div data-testid="cart">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <CartItemCard 
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
              />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
            </div>
            {coupons.length > 0 && (
              <select
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={selectedCoupon?.code || ''}
                onChange={(e) => {
                  const coupon = coupons.find(c => c.code === e.target.value);
                  applyCoupon(coupon || null);
                }}
                role="combobox"
              >
                <option value="">쿠폰 선택</option>
                {coupons.map(coupon => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.name} ({coupon.discountType === 'amount'
                      ? `${coupon.discountValue.toLocaleString()}원`
                      : `${coupon.discountValue}%`})
                  </option>
                ))}
              </select>
            )}
          </section>

          <CartSummary cartTotal={cartTotal} onCheckout={handleCheckout} />
        </>
      )}
    </div>
  );
};
