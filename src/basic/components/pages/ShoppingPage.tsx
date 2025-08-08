// components/pages/ShoppingPage.tsx
import { useState, useCallback, useEffect } from 'react';
import { calculateCartTotal, calculateItemTotal } from '../../utils/calculators';
import { formatPrice } from '../../utils/formatters';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useCoupons } from '../../hooks/useCoupons';
import { ProductCard } from '../ProductCard';
import { CartItemComponent } from '../CartItem';
import { Button } from '../ui/Button';

export const ShoppingPage = ({
  addNotification,
}: {
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);

  const { products } = useProducts();
  const {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getRemainingStock,
  } = useCart(addNotification);
  const { selectedCoupon, setSelectedCoupon, coupons, applyCoupon } =
    useCoupons(cart, addNotification);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification, setCart, setSelectedCoupon]);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              <div className="ml-8 flex-1 max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="상품 검색..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <div className="relative">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* 상품 목록 */}
            <section>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  전체 상품
                </h2>
                <div className="text-sm text-gray-600">
                  총 {products.length}개 상품
                </div>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      getRemainingStock={getRemainingStock}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  장바구니
                </h2>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      장바구니가 비어있습니다
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <CartItemComponent
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        calculateItemTotal={(item) => calculateItemTotal(item, cart)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {cart.length > 0 && (
                <>
                  <section className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        쿠폰 할인
                      </h3>
                      <Button variant="secondary" className="text-xs">
                        쿠폰 등록
                      </Button>
                    </div>
                    {coupons.length > 0 && (
                      <select
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={selectedCoupon?.code || ''}
                        onChange={(e) => {
                          const coupon = coupons.find(
                            (c) => c.code === e.target.value
                          );
                          if (coupon) applyCoupon(coupon);
                          else setSelectedCoupon(null);
                        }}
                      >
                        <option value="">쿠폰 선택</option>
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

                  <section className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">상품 금액</span>
                        <span className="font-medium">
                          {calculateCartTotal(
                            cart,
                            selectedCoupon
                          ).totalBeforeDiscount.toLocaleString()}
                          원
                        </span>
                      </div>
                      {calculateCartTotal(cart, selectedCoupon)
                        .totalBeforeDiscount -
                        calculateCartTotal(cart, selectedCoupon)
                          .totalAfterDiscount >
                        0 && (
                        <div className="flex justify-between text-red-500">
                          <span>할인 금액</span>
                          <span>
                            -
                            {(
                              calculateCartTotal(cart, selectedCoupon)
                                .totalBeforeDiscount -
                              calculateCartTotal(cart, selectedCoupon)
                                .totalAfterDiscount
                            ).toLocaleString()}
                            원
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="font-semibold">결제 예정 금액</span>
                        <span className="font-bold text-lg text-gray-900">
                          {calculateCartTotal(
                            cart,
                            selectedCoupon
                          ).totalAfterDiscount.toLocaleString()}
                          원
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={completeOrder}
                      className="w-full mt-4 py-3"
                    >
                      {calculateCartTotal(
                        cart,
                        selectedCoupon
                      ).totalAfterDiscount.toLocaleString()}
                      원 결제하기
                    </Button>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                      <p>* 실제 결제는 이루어지지 않습니다</p>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
