import { CartItem as CartItemType, Coupon } from '../../../types';
import { calculateItemTotal } from '../../utils/calculations/cartCalculations';
import Button from '../ui/Button';
import CartItem from './CartItem';

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
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className='text-center py-8'>
              <svg
                className='w-16 h-16 text-gray-300 mx-auto mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
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
            <section className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
                <Button variant='link' className='text-xs'>
                  쿠폰 등록
                </Button>
              </div>
              {coupons.length > 0 && (
                <select
                  className='w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                  value={selectedCoupon?.code || ''}
                  onChange={(e) => {
                    const coupon = coupons.find((c) => c.code === e.target.value);
                    // if (coupon) onApplyCoupon(coupon, cart);
                    // else onSelectedCouponChange(null);

                    coupon ? onApplyCoupon(coupon, cart) : onSelectedCouponChange(null);
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
                </select>
              )}
            </section>

            <section className='bg-white rounded-lg border border-gray-200 p-4'>
              <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>상품 금액</span>
                  <span className='font-medium'>
                    {totals.totalBeforeDiscount.toLocaleString()}원
                  </span>
                </div>
                {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                  <div className='flex justify-between text-red-500'>
                    <span>할인 금액</span>
                    <span>
                      -{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}원
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

              {/* Todo :: primary - lg 사이즈 옵션 수정 */}
              <Button
                onClick={onCompleteOrder}
                size='lg'
                className='w-full hover:bg-yellow-500 bg-yellow-400 !text-gray-900 mt-4 py-3'
              >
                {totals.totalAfterDiscount.toLocaleString()}원 결제하기
              </Button>

              <div className='mt-3 text-xs text-gray-500 text-center'>
                <p>* 실제 결제는 이루어지지 않습니다</p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
