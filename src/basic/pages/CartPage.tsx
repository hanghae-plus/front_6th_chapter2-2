import { useCallback } from 'react';
import { Coupon } from '../../types';
import { ProductWithUI } from '../shared/types';
import * as cartModel from '../models/cart';
import { formatKoreanPrice, formatPercentage } from '../shared/utils';
import { STOCK } from '../constants/product';
import { MESSAGES } from '../constants/message';
import { CloseIcon, ImageIcon, SmallBagIcon, LargeBagIcon } from '../components/icons';

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  searchTerm: string;
  cart: Array<{ product: ProductWithUI; quantity: number }>;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  selectCoupon: (coupon: Coupon | null) => void;
  addToCart: (product: ProductWithUI, onSuccess: (message: string) => void, onError: (message: string) => void) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: ProductWithUI[],
    onError: (message: string) => void,
  ) => void;
  applyCoupon: (coupon: Coupon, onSuccess: (message: string) => void, onError: (message: string) => void) => void;
  calculateTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number };
  getRemainingStock: (product: ProductWithUI) => number;
  clearCart: () => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export function CartPage({
  products,
  filteredProducts,
  searchTerm,
  cart,
  coupons,
  selectedCoupon,
  selectCoupon,
  addToCart: addToCartHook,
  removeFromCart,
  updateQuantity: updateQuantityHook,
  applyCoupon: applyCouponHook,
  calculateTotal,
  getRemainingStock,
  clearCart,
  addNotification,
}: CartPageProps) {
  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    return `₩${price.toLocaleString()}`;
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      addToCartHook(
        product,
        (message) => addNotification(message, 'success'),
        (message) => addNotification(message, 'error'),
      );
    },
    [addToCartHook, addNotification],
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      updateQuantityHook(productId, newQuantity, products, (message) => addNotification(message, 'error'));
    },
    [updateQuantityHook, products, addNotification],
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      applyCouponHook(
        coupon,
        (message) => addNotification(message, 'success'),
        (message) => addNotification(message, 'error'),
      );
    },
    [applyCouponHook, addNotification],
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(MESSAGES.ORDER.COMPLETED(orderNumber), 'success');
    clearCart();
  }, [addNotification, clearCart]);

  const totals = calculateTotal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const remainingStock = getRemainingStock(product);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* 상품 이미지 영역 */}
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <ImageIcon />
                      </div>
                      {product.isRecommended && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          BEST
                        </span>
                      )}
                      {product.discounts.length > 0 && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
                        </span>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                      )}

                      {/* 가격 정보 */}
                      <div className="mb-3">
                        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price, product.id)}</p>
                        {product.discounts.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
                          </p>
                        )}
                      </div>

                      {/* 재고 상태 */}
                      <div className="mb-3">
                        {remainingStock <= STOCK.LOW_THRESHOLD && remainingStock > 0 && (
                          <p className="text-xs text-red-600 font-medium">
                            {MESSAGES.PRODUCT.LOW_STOCK(remainingStock)}
                          </p>
                        )}
                        {remainingStock > STOCK.LOW_THRESHOLD && (
                          <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
                        )}
                      </div>

                      {/* 장바구니 버튼 */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={remainingStock <= 0}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                          remainingStock <= 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {remainingStock <= 0 ? '품절' : '장바구니 담기'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <SmallBagIcon />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <LargeBagIcon />
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemTotal = cartModel.calculateItemTotal(item, cart);
                  const originalPrice = item.product.price * item.quantity;
                  const hasDiscount = itemTotal < originalPrice;
                  const discountRate = hasDiscount ? formatPercentage(1 - itemTotal / originalPrice) : 0;

                  return (
                    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <span className="text-xs">−</span>
                          </button>
                          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <span className="text-xs">+</span>
                          </button>
                        </div>
                        <div className="text-right">
                          {hasDiscount && (
                            <span className="text-xs text-red-500 font-medium block">-{discountRate}</span>
                          )}
                          <p className="text-sm font-medium text-gray-900">{formatKoreanPrice(itemTotal)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              {/* 쿠폰 섹션 */}
              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
                  <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
                </div>
                {coupons.length > 0 && (
                  <select
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={selectedCoupon?.code || ''}
                    onChange={(e) => {
                      const coupon = coupons.find((c) => c.code === e.target.value);
                      if (coupon) applyCoupon(coupon);
                      else selectCoupon(null);
                    }}
                  >
                    <option value="">쿠폰 선택</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.code} value={coupon.code}>
                        {coupon.name} (
                        {coupon.discountType === 'amount'
                          ? `${formatKoreanPrice(coupon.discountValue)}`
                          : `${coupon.discountValue}%`}
                        )
                      </option>
                    ))}
                  </select>
                )}
              </section>

              {/* 결제 정보 */}
              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="font-medium">{formatKoreanPrice(totals.totalBeforeDiscount)}</span>
                  </div>
                  {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인 금액</span>
                      <span>-{formatKoreanPrice(totals.totalBeforeDiscount - totals.totalAfterDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="font-semibold">결제 예정 금액</span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatKoreanPrice(totals.totalAfterDiscount)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={completeOrder}
                  className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                >
                  {formatKoreanPrice(totals.totalAfterDiscount)} 결제하기
                </button>

                <div className="mt-3 text-xs text-gray-500 text-center">
                  <p>* 실제 결제는 이루어지지 않습니다</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
