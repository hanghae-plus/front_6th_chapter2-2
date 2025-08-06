import { useCallback } from 'react';
import { CartItem, Coupon, Product } from '../../models/entities';
import { calculateCartTotal } from '../../utils/calulator.ts';
import { BagIcon } from '../icons';
import Button from '../ui/Button.tsx';
import CartListItem from './CartItem.tsx';
import Select from '../ui/Select.tsx';
import EmptyCart from './EmptyCart.tsx';
import CartSection from './CartSection.tsx';

interface CartListProps {
  cart: CartItem[];
  coupons: Coupon[];
  addToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
  onResetCart: () => void;
  onResetCoupon: () => void;
  selectedCoupon: Coupon | null;
}
const CartList = ({
  cart,
  coupons,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  addNotification,
  onResetCart,
  onResetCoupon,
  selectedCoupon,
}: CartListProps) => {
  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };
  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    onResetCart();
    onResetCoupon();
  }, [addNotification]);
  const totals = calculateCartTotal(cart, selectedCoupon);
  const handleChangeOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find(c => c.code === e.target.value);
    if (coupon) onApplyCoupon(coupon);
    else onResetCoupon();
  };
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <CartSection>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BagIcon />
            장바구니
          </h2>
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="space-y-3">
              {cart.map(item => {
                const itemTotal = calculateItemTotal(item);
                return (
                  <CartListItem
                    key={`cart-item-${item.product.name}`}
                    item={item}
                    itemTotal={itemTotal}
                    onRemoveFromCart={onRemoveFromCart}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                );
              })}
            </ul>
          )}
        </CartSection>

        {cart.length > 0 && (
          <>
            <CartSection>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  쿠폰 할인
                </h3>
                <Button className="text-xs text-blue-600 hover:underline">
                  쿠폰 등록
                </Button>
              </div>
              {coupons.length > 0 && (
                <Select
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={selectedCoupon?.code || ''}
                  items={coupons}
                  defaultText={'쿠폰 선택'}
                  getLabel={coupon =>
                    `${coupon.name} (${coupon.discountValue}${coupon.discountType === 'amount' ? '원' : '%'})`
                  }
                  getValue={coupon => `${coupon.code}`}
                  onChange={handleChangeOption}
                />
              )}
            </CartSection>

            <CartSection>
              <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">
                    {totals.totalBeforeDiscount.toLocaleString()}원
                  </span>
                </div>
                {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>할인 금액</span>
                    <span>
                      -
                      {(
                        totals.totalBeforeDiscount - totals.totalAfterDiscount
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="font-semibold">결제 예정 금액</span>
                  <span className="font-bold text-lg text-gray-900">
                    {totals.totalAfterDiscount.toLocaleString()}원
                  </span>
                </div>
              </div>

              <Button
                onClick={completeOrder}
                className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
              >
                {totals.totalAfterDiscount.toLocaleString()}원 결제하기
              </Button>

              <div className="mt-3 text-xs text-gray-500 text-center">
                <p>* 실제 결제는 이루어지지 않습니다</p>
              </div>
            </CartSection>
          </>
        )}
      </div>
    </div>
  );
};

export default CartList;
