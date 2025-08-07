import { CartItem, Coupon, Product } from '../../../../models/entities';
import {
  calculateCartTotal,
  calculateItemTotal,
} from '../../../../utils/calulator.ts';
import { BagIcon } from '../../../icons';
import Button from '../../../ui/Button.tsx';
import CartListItem from './CartItem.tsx';
import Select from '../../../ui/Select.tsx';
import EmptyCart from './EmptyCart.tsx';
import CartSection from './CartSection.tsx';
import ResultContent from '../checkoutInfo/ResultContent.tsx';
import { NotificationHandler } from '../../../../models/components/toast.types.ts';
interface CartListProps {
  cart: CartItem[];
  coupons: Coupon[];
  addToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  addNotification: NotificationHandler;
  onResetCart: () => void;
  onResetCoupon: () => void;
  selectedCoupon: Coupon | null;
}

const CartArea = ({
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
                const itemTotal = calculateItemTotal(item, cart);
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
              <ResultContent
                totals={totals}
                addNotification={addNotification}
                onResetCart={onResetCart}
                onResetCoupon={onResetCoupon}
              />
            </CartSection>
          </>
        )}
      </div>
    </div>
  );
};

export default CartArea;
