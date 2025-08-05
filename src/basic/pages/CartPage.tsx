import { ICartItem, ICoupon, IProductWithUI } from "../type";
import { formatPrice } from "../utils/formatters";
import { SmallBagIcon, LargeBagIcon } from "../components/icon";
import ProductItem from "../components/ProductItem";
import CartItem from "../components/CartItem";
import { useCallback } from "react";

interface CartPageProps {
  // product
  products: IProductWithUI[];
  getRemainingStock: (product: IProductWithUI) => number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  addToCart: (product: IProductWithUI) => void;
  removeFromCart: (productId: string) => void;

  // cart
  cart: ICartItem[];
  cartTotalPrice: { totalBeforeDiscount: number; totalAfterDiscount: number };
  calculateItemTotal: (item: ICartItem) => number;
  clearCart: () => void;

  // coupons
  coupons: ICoupon[];
  selectedCoupon: ICoupon | null;
  setSelectedCoupon: (value: React.SetStateAction<ICoupon | null>) => void;

  // search
  debouncedSearchTerm?: string;

  // notification
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const CartPage = ({
  products,
  getRemainingStock,
  updateQuantity,
  addToCart,
  removeFromCart,
  cart,
  cartTotalPrice,
  calculateItemTotal,
  clearCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  debouncedSearchTerm,
  addNotification,
}: CartPageProps) => {
  // 장바구니 담기 버튼 처리
  const addItemToCart = useCallback(
    (product: IProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      addToCart(product);
      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, getRemainingStock]
  );

  // 장바구니의 상품 수 업데이트 (-1, +1 처리)
  const updateItemQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItemFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, addNotification, getRemainingStock]
  );

  // 장바구니에서 상품 제거
  const removeItemFromCart = useCallback((productId: string) => {
    removeFromCart(productId);
  }, []);

  // 쿠폰 적용 함수
  const applyCoupon = useCallback(
    (coupon: ICoupon) => {
      // 할인 적용 전 총 가격
      const currentTotal = cartTotalPrice.totalAfterDiscount;

      // 총 가격 10000원 이하일 경우 처리
      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      // 쿠폰 적용 후 알림 처리
      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, cartTotalPrice]
  );

  // 주문 완료 처리 함수
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification]);

  // 검색어 반영된 상품 목록
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

  // 가격 텍스트 처리
  const getPriceText = (item: IProductWithUI) => {
    if (item && getRemainingStock(item) <= 0) return "SOLD OUT";
    return formatPrice(item.price, "krw");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
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
              {filteredProducts.map((product) => {
                const remainingStock = getRemainingStock(product);

                return (
                  // 상품 컴포넌트
                  <ProductItem
                    product={product}
                    remainingStock={remainingStock}
                    priceText={getPriceText(product)}
                    addItemToCart={addItemToCart}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 장바구니 + 결제 정보 컨테이너 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              {/* 장바구니 아이콘 */}
              <SmallBagIcon />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                {/* 장바구니 큰 아이콘 */}
                <LargeBagIcon />
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  return (
                    // 카트 상품 컴포넌트
                    <CartItem
                      item={item}
                      calculateItemTotal={calculateItemTotal}
                      removeItemFromCart={removeItemFromCart}
                      updateItemQuantity={updateItemQuantity}
                    />
                  );
                })}
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
                  <button className="text-xs text-blue-600 hover:underline">
                    쿠폰 등록
                  </button>
                </div>
                {coupons.length > 0 && (
                  <select
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={selectedCoupon?.code || ""}
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
                        {coupon.discountType === "amount"
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
                      {cartTotalPrice.totalBeforeDiscount.toLocaleString()}원
                    </span>
                  </div>
                  {cartTotalPrice.totalBeforeDiscount -
                    cartTotalPrice.totalAfterDiscount >
                    0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인 금액</span>
                      <span>
                        -
                        {(
                          cartTotalPrice.totalBeforeDiscount -
                          cartTotalPrice.totalAfterDiscount
                        ).toLocaleString()}
                        원
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="font-semibold">결제 예정 금액</span>
                    <span className="font-bold text-lg text-gray-900">
                      {cartTotalPrice.totalAfterDiscount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  onClick={completeOrder}
                  className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                >
                  {cartTotalPrice.totalAfterDiscount.toLocaleString()}원 결제하기
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
};

export default CartPage;
