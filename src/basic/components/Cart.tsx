// src/basic/components/Cart.tsx
import { CartItem, Coupon } from '../types';
import { formatCurrency } from '../utils/formatters';

interface Props {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onApplyCoupon: (coupon: Coupon | null) => void;
  cartTotal: {
    totalBeforeDiscount: number;
    totalDiscount: number;
    finalTotal: number;
  };
  onCheckout: () => void;
}

export const Cart = ({
  cart,
  coupons,
  selectedCoupon,
  onUpdateQuantity,
  onRemoveFromCart,
  onApplyCoupon,
  cartTotal,
  onCheckout,
}: Props) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mt-6">
      <h2 className="text-2xl font-bold mb-4">장바구니</h2>
      {cart.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <div>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2">+</button>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
              <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500">삭제</button>
            </div>
          ))}
          <div className="mt-4">
            <select
              onChange={(e) => {
                const selected = coupons.find(c => c.code === e.target.value);
                onApplyCoupon(selected || null);
              }}
              value={selectedCoupon?.code || ''}
              className="p-2 border rounded"
            >
              <option value="">쿠폰 선택</option>
              {coupons.map(coupon => (
                <option key={coupon.code} value={coupon.code}>{coupon.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p>총액 (할인 전): {formatCurrency(cartTotal.totalBeforeDiscount)}</p>
            <p className="text-red-500">할인 금액: -{formatCurrency(cartTotal.totalDiscount)}</p>
            <p className="font-bold">최종 결제 금액: {formatCurrency(cartTotal.finalTotal)}</p>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            결제하기
          </button>
        </>
      )}
    </div>
  );
};
