import { Product, ProductWithUI } from "../entities/product/types";
import { ProductList } from "../entities/product/ui/ProductList";
import { formatPrice } from "../shared/libs/price";

import { useCallback } from "react";
import { CartItemList } from "../features/view-cart-items/ui/CartItemList";
import { CouponSelector } from "../features/select-coupon/ui/CouponSelector";
import { CheckoutSection } from "../features/checkout/ui/CheckoutSection";
import CartBagIcon from "../assets/icons/CartBagIcon.svg?react";
import { NotificationVariant } from "../entities/notification/types";
import { getStockDisplay } from "../entities/product/libs/stock";
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
    const stockStatus = getStockDisplay(product.stock, 0);
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
            <CartItemList
              cartItems={cart.cart}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              calculateItemTotal={cart.getItemTotal}
            />
          </section>

          {cart.cart.length > 0 && (
            <>
              <CouponSelector
                coupons={couponFeature.coupons}
                selectedCoupon={couponFeature.selectedCoupon}
                onCouponSelect={(coupon) => {
                  if (coupon) couponFeature.applyCoupon(coupon);
                  else couponFeature.removeCoupon();
                }}
              />

              <CheckoutSection
                totalBeforeDiscount={totalBeforeDiscount}
                totalAfterDiscount={totalAfterDiscount}
                onCompleteOrder={completeOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
