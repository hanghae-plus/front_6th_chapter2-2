import { useCallback } from "react";
import CartBagIcon from "@assets/icons/CartBagIcon.svg?react";
import { useCart } from "@entities/cart";
import {
  useGlobalNotification,
  NotificationVariant,
} from "@entities/notification";
import {
  ProductWithUI,
  getDisplayPrice,
  ProductList,
  Product,
} from "@entities/product";
import {
  useAddToCart,
  useUpdateCartQuantity,
  useApplyCoupon,
  CartItemList,
  CouponSelector,
  CheckoutSection,
} from "@features";

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

  const { addToCart, getProductRemainingStock } = useAddToCart({
    cart: cart.cart,
    onAddItem: cart.addItem,
  });

  const { updateQuantity } = useUpdateCartQuantity({
    products,
    onUpdateQuantity: cart.updateItemQuantity,
  });

  const couponActions = useApplyCoupon(cart.cart);

  const displayPrice = (product: Product) => {
    const cartQuantity =
      cart.cart.find((item) => item.product.id === product.id)?.quantity || 0;
    return getDisplayPrice(product, cartQuantity);
  };

  const { totalAfterDiscount, totalBeforeDiscount } =
    couponActions.getCartSummaryWithCoupon();

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
    couponActions.clearCoupon();
  }, [addNotification, cart, couponActions]);

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
                coupons={couponActions.coupons}
                selectedCoupon={couponActions.selectedCoupon}
                onCouponSelect={(coupon) => {
                  if (coupon) couponActions.applyCoupon(coupon);
                  else couponActions.removeCoupon();
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
