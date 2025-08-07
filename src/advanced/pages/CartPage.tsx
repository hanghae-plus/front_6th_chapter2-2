import { useCallback } from "react";
import { CartItem, ProductWithUI, Coupon, Product } from "../../types";
import { CartIcon } from "../components/icons";
import ProductList from "../components/cart/ProductList";
import EmptyCart from "../components/cart/EmptyCart";
import CartItemList from "../components/cart/CartItemList";
import { NOTIFICATION_MESSAGE } from "../constants";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { addNotificationAtom } from "../atoms/notification";
import { selectedCouponAtom } from "../atoms/selectedCoupon";
import { cartWithLocalStorageAtom } from "../atoms/cart";
import { productsWithLocalStorageAtom } from "../atoms/products";
import { couponsWithLocalStorageAtom } from "../atoms/coupons";

interface CartPageProps {
  filteredProducts: Array<ProductWithUI>;
  debouncedSearchTerm: string;
  handleApplyCoupon: (coupon: Coupon, currentTotal: number) => void;
  getRemainingStock: (product: Product) => number;
  updateCartItemQuantity: (
    cart: Array<CartItem>,
    productId: string,
    newQuantity: number
  ) => CartItem[];
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  calculateItemTotal: (item: CartItem) => number;
}

const CartPage = ({
  filteredProducts,
  debouncedSearchTerm,
  handleApplyCoupon,
  getRemainingStock,
  updateCartItemQuantity,
  totals,
  calculateItemTotal,
}: CartPageProps) => {
  const coupons = useAtomValue(couponsWithLocalStorageAtom);
  const products = useAtomValue(productsWithLocalStorageAtom);
  const addNotification = useSetAtom(addNotificationAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [cart, setCart] = useAtom(cartWithLocalStorageAtom);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification({
          message: NOTIFICATION_MESSAGE.ERROR.NONE_STOCK,
          type: "error",
        });
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          addNotification({
            message: NOTIFICATION_MESSAGE.ERROR.INSUFFICIENT_STOCK(
              product.stock
            ),
            type: "error",
          });
          return;
        }
        setCart(updateCartItemQuantity(cart, product.id, newQuantity));
      } else {
        setCart([...cart, { product, quantity: 1 }]);
      }

      addNotification({
        message: NOTIFICATION_MESSAGE.CART.ADD,
        type: "success",
      });
    },
    [cart, setCart, getRemainingStock, addNotification]
  );

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification({
        message: NOTIFICATION_MESSAGE.ERROR.INSUFFICIENT_STOCK(maxStock),
        type: "error",
      });
      return;
    }

    const updateCart = updateCartItemQuantity(cart, productId, newQuantity);
    setCart(updateCart);
  };

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    const message = NOTIFICATION_MESSAGE.ORDER.ADD(orderNumber);
    addNotification({ message, type: "success" });
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  return (
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
              <ProductList
                products={filteredProducts}
                addToCart={addToCart}
                getRemainingStock={getRemainingStock}
              />
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CartIcon type={"default"} strokeWidth={2} />
                장바구니
              </h2>
              {cart.length === 0 ? (
                <EmptyCart />
              ) : (
                <CartItemList
                  cart={cart}
                  calculateItemTotal={calculateItemTotal}
                  handleRemoveFromCart={handleRemoveFromCart}
                  updateQuantity={updateQuantity}
                />
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
                        const currentTotal = totals.totalAfterDiscount;
                        const coupon = coupons.find(
                          (c) => c.code === e.target.value
                        );
                        if (coupon) handleApplyCoupon(coupon, currentTotal);
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
                        {totals.totalBeforeDiscount.toLocaleString()}원
                      </span>
                    </div>
                    {totals.totalBeforeDiscount - totals.totalAfterDiscount >
                      0 && (
                      <div className="flex justify-between text-red-500">
                        <span>할인 금액</span>
                        <span>
                          -
                          {(
                            totals.totalBeforeDiscount -
                            totals.totalAfterDiscount
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

                  <button
                    onClick={completeOrder}
                    className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                  >
                    {totals.totalAfterDiscount.toLocaleString()}원 결제하기
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
    </main>
  );
};

export default CartPage;
