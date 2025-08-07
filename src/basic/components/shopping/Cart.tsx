import { CartItem, Coupon } from '../../../types';
import { calculateItemTotal, calculateOriginalPrice } from '../../models/cart';
import {
  hasDiscount,
  calculateDiscountRate,
  hasTotalDiscount,
  calculateTotalDiscountAmount,
} from '../../models/discount';
import { CloseIcon, CartHeaderIcon, EmptyCartIcon } from '../icons';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Select from '../ui/Selector';

interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

const Cart = ({
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleApplyCoupon,
  handleCompleteOrder,
  handleUpdateQuantity,
  removeFromCart,
  totals,
}: {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  handleApplyCoupon: (coupon: Coupon) => void;
  handleCompleteOrder: () => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  totals: CartTotal;
}) => {
  return (
    <div className='sticky top-24 space-y-4'>
      <Card
        padding='sm'
        headerStyle='margin'
        header={
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <CartHeaderIcon />
            장바구니
          </h2>
        }
      >
        {cart.length === 0 ? (
          <div className='text-center py-8'>
            <EmptyCartIcon />
            <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {cart.map((item) => {
              const itemTotal = calculateItemTotal(item, cart);
              const originalPrice = calculateOriginalPrice(item);
              const hasDiscountValue = hasDiscount(itemTotal, originalPrice);
              const discountRate = calculateDiscountRate(itemTotal, originalPrice);

              return (
                <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
                  <div className='flex justify-between items-start mb-2'>
                    <h4 className='text-sm font-medium text-gray-900 flex-1'>
                      {item.product.name}
                    </h4>
                    <Button
                      onClick={() => removeFromCart(item.product.id)}
                      className='text-gray-400 hover:text-red-500 ml-2'
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        hasRounded
                        className='w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                      >
                        <span className='text-xs'>−</span>
                      </Button>
                      <span className='mx-3 text-sm font-medium w-8 text-center'>
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        hasRounded
                        className='w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                      >
                        <span className='text-xs'>+</span>
                      </Button>
                    </div>
                    <div className='text-right'>
                      {hasDiscountValue && (
                        <Badge size='xs' rounded='none' className='text-red-500 font-medium block'>
                          -{discountRate}%
                        </Badge>
                      )}
                      <p className='text-sm font-medium text-gray-900'>
                        {Math.round(itemTotal).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {cart.length > 0 && (
        <>
          <Card
            padding='sm'
            headerStyle='margin'
            header={
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
                <Button className='text-xs text-blue-600 hover:underline'>쿠폰 등록</Button>
              </div>
            }
          >
            {coupons.length > 0 && (
              <Select
                focusStyle='blue'
                value={selectedCoupon?.code || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const coupon = coupons.find((c) => c.code === e.target.value);
                  if (coupon) handleApplyCoupon(coupon);
                  else setSelectedCoupon(null);
                }}
              >
                <option value=''>쿠폰 선택</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.name} (
                    {coupon.discountType === 'amount'
                      ? `${coupon.discountValue.toLocaleString()}원`
                      : `${coupon.discountValue}%`}
                    )
                  </option>
                ))}
              </Select>
            )}
          </Card>

          <Card
            padding='sm'
            headerStyle='margin'
            header={<h3 className='text-lg font-semibold mb-4'>결제 정보</h3>}
          >
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>상품 금액</span>
                <span className='font-medium'>{totals.totalBeforeDiscount.toLocaleString()}원</span>
              </div>
              {hasTotalDiscount(totals.totalBeforeDiscount, totals.totalAfterDiscount) && (
                <div className='flex justify-between text-red-500'>
                  <span>할인 금액</span>
                  <span>
                    -
                    {calculateTotalDiscountAmount(
                      totals.totalBeforeDiscount,
                      totals.totalAfterDiscount
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              )}
              <div className='flex justify-between py-2 border-t border-gray-200'>
                <span className='font-semibold'>결제 예정 금액</span>
                <span className='font-bold text-lg text-gray-900'>
                  {totals.totalAfterDiscount.toLocaleString()}원
                </span>
              </div>
            </div>

            <Button
              onClick={handleCompleteOrder}
              hasFontMedium
              hasTransition
              hasRounded
              className='w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500'
            >
              {totals.totalAfterDiscount.toLocaleString()}원 결제하기
            </Button>

            <div className='mt-3 text-xs text-gray-500 text-center'>
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Cart;
