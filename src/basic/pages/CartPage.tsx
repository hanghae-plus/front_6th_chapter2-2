import CartBagIcon from "@assets/icons/CartBagIcon.svg?react";
import {
  ProductWithUI,
  getDisplayPrice,
  ProductList,
  Product,
} from "@entities/product";
import { CartItemList, CouponSelector, CheckoutSection } from "@features";
import { getCartDiscountSummary } from "@features/checkout";
import { useManageCart } from "@features/manage-cart";
import { useManageCoupon } from "@features/manage-coupon";
import { useProcessOrder } from "@features/process-order";
import { useCallback, useMemo } from "react";

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
  const cartManager = useManageCart({ products });
  const couponManager = useManageCoupon();
  const orderProcessor = useProcessOrder({
    onClearCart: cartManager.clearCart,
    onClearCoupon: couponManager.removeCoupon,
  });

  const displayPrice = useCallback(
    (product: Product) => {
      const cartQuantity =
        cartManager.cart.find((item) => item.id === product.id)?.quantity || 0;
      return getDisplayPrice(product, cartQuantity);
    },
    [cartManager.cart]
  );

  const cartSummary = useMemo(
    () =>
      getCartDiscountSummary(cartManager.cart, couponManager.selectedCoupon),
    [cartManager.cart, couponManager.selectedCoupon]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          searchValue={searchValue}
          getProductRemainingStock={cartManager.getProductRemainingStock}
          displayPrice={displayPrice}
          onAddToCart={cartManager.addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CartBagIcon className="w-5 h-5 mr-2" />
              장바구니
            </h2>
            <CartItemList
              cartItems={cartManager.cart}
              onRemoveItem={cartManager.removeItem}
              onUpdateQuantity={cartManager.updateQuantity}
              calculateItemTotal={cartManager.getItemTotal}
            />
          </section>

          {cartManager.cart.length > 0 && (
            <>
              <CouponSelector
                coupons={couponManager.coupons}
                selectedCoupon={couponManager.selectedCoupon}
                onCouponSelect={(coupon) => {
                  if (coupon) {
                    const { totalAfterDiscount } = getCartDiscountSummary(
                      cartManager.cart,
                      null
                    );
                    couponManager.applyCoupon(coupon, totalAfterDiscount);
                  } else {
                    couponManager.removeCoupon();
                  }
                }}
              />

              <CheckoutSection
                totalBeforeDiscount={cartSummary.totalBeforeDiscount}
                totalAfterDiscount={cartSummary.totalAfterDiscount}
                onCompleteOrder={orderProcessor.completeOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
