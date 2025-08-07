import { Product, ProductWithUI } from "../entities/product/types";
import { ProductList } from "../entities/product/ui/ProductList";
import { formatPrice } from "../shared/libs/price";

import { useCallback } from "react";
import { CartItem } from "../entities/cart/ui/CartItem";
import CartBagIcon from "../assets/icons/CartBagIcon.svg?react";
import { NotificationVariant } from "../entities/notification/types";
import { getProductStockStatus } from "../features/check-stock/libs";
import { useGlobalNotification } from "../entities/notification/hooks/useGlobalNotification";
import { useCart } from "../entities/cart/hooks/useCart";
import { useAddToCart } from "../features/add-to-cart/hooks/useAddToCart";
import { useUpdateCartQuantity } from "../features/update-cart-quantity/hooks/useUpdateCartQuantity";
import { useApplyCoupon } from "../features/apply-coupon/hooks/useApplyCoupon";

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  searchValue: string;
}

export function CartPage({
  products,
  filteredProducts,
  searchValue,
}: CartPageProps) {
  const cart = useCart();
  const { addNotification } = useGlobalNotification();

  const addToCartFeature = useAddToCart({
    cart: cart.cart,
    onAddItem: cart.addItem,
  });

  const updateQuantityFeature = useUpdateCartQuantity({
    products,
    onUpdateQuantity: cart.updateItemQuantity,
  });

  const couponFeature = useApplyCoupon(cart.cart);

  const displayPrice = (product: Product) => {
    const stockStatus = getProductStockStatus({ product, cartQuantity: 0 });
    if (stockStatus) return stockStatus;

    const formattedPrice = formatPrice(product.price);
    return `₩${formattedPrice}`;
  };

  const { totalAfterDiscount, totalBeforeDiscount } =
    couponFeature.getCartSummaryWithCoupon();

  const { addToCart, getProductRemainingStock } = addToCartFeature;
  const { updateQuantity } = updateQuantityFeature;

  const removeFromCart = useCallback(
    (productId: string) => {
      cart.removeItem(productId);
    },
    [cart]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      NotificationVariant.SUCCESS
    );
    cart.clearCart();
    couponFeature.clearCoupon();
  }, [addNotification, cart, couponFeature]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          searchValue={searchValue}
          getProductRemainingStock={getProductRemainingStock}
          displayPrice={displayPrice}
          onAddToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CartBagIcon className="w-5 h-5 mr-2" />
              장바구니
            </h2>
            {cart.cart.length === 0 ? (
              <div className="text-center py-8">
                <CartBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.cart.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    calculateItemTotal={cart.getItemTotal}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                ))}
              </div>
            )}
          </section>

          {cart.cart.length > 0 && (
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
                {couponFeature.coupons.length > 0 && (
                  <select
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={couponFeature.selectedCoupon?.code || ""}
                    onChange={(e) => {
                      const coupon = couponFeature.coupons.find(
                        (c) => c.code === e.target.value
                      );
                      if (coupon) couponFeature.applyCoupon(coupon);
                      else couponFeature.removeCoupon();
                    }}
                  >
                    <option value="">쿠폰 선택</option>
                    {couponFeature.coupons.map((coupon) => (
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
                      {totalBeforeDiscount.toLocaleString()}원
                    </span>
                  </div>
                  {totalBeforeDiscount - totalAfterDiscount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인 금액</span>
                      <span>
                        -
                        {(
                          totalBeforeDiscount - totalAfterDiscount
                        ).toLocaleString()}
                        원
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="font-semibold">결제 예정 금액</span>
                    <span className="font-bold text-lg text-gray-900">
                      {totalAfterDiscount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  onClick={completeOrder}
                  className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                >
                  {totalAfterDiscount.toLocaleString()}원 결제하기
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
