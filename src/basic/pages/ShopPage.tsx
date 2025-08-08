import { useCallback } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { generateOrderNumber } from "../models/coupon";
import { canApplyCoupon } from "../models/discount";
import { filterProducts, ProductWithUI } from "../models/product";
import {
  getRemainingStock,
  addToCart as _addToCart,
  removeFromCart as _removeFromCart,
  updateQuantity as _updateQuantity,
  calculateCartTotal,
} from "../models/cart";

import ShopProduct from "../components/ShopProduct";
import PaymentInfo from "../components/PaymentInfo";
import CouponDiscount from "../components/CouponDiscount";
import Cart from "../components/Cart";

interface Props {
  searchTerm: string;
  products: Product[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;

  // NOTE: 임시props
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
}

const ShopPage = ({
  searchTerm,
  cart,
  products,
  coupons,
  selectedCoupon,
  addNotification,
  formatPrice,
  setCart,
  setSelectedCoupon,
}: Props) => {
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = _addToCart(cart, product);

      if (!result.success) {
        addNotification(result.reason, "error");

        return;
      }

      setCart(result.cart);

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((cartItem: CartItem) => {
    setCart((prevCart) => _removeFromCart(prevCart, cartItem.product.id));
  }, []);

  const decreaseCartItem = useCallback(
    (cartItem: CartItem) => {
      const result = _updateQuantity(
        cart,
        cartItem.product,
        cartItem.quantity - 1
      );

      if (!result.success) {
        return addNotification(result.reason, "error");
      }

      setCart(result.cart);
    },
    [addNotification, cart]
  );

  const IncreaseCartItem = useCallback(
    (cartItem: CartItem) => {
      const result = _updateQuantity(
        cart,
        cartItem.product,
        cartItem.quantity + 1
      );

      if (!result.success) {
        return addNotification(result.reason, "error");
      }

      setCart(result.cart);
    },
    [addNotification, cart]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      const validation = canApplyCoupon(coupon, currentTotal);
      if (!validation.canApply) {
        addNotification(validation.reason!, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, cart, selectedCoupon]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const filteredProducts = filterProducts(products, searchTerm);

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
                "{searchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ShopProduct
                  key={product.id}
                  product={product}
                  remainingStock={getRemainingStock(cart, product)}
                  onAddToCart={() => addToCart(product)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            cart={cart}
            onRemove={removeFromCart}
            onDecrease={decreaseCartItem}
            onIncrease={IncreaseCartItem}
          />

          {cart.length > 0 && (
            <>
              <CouponDiscount
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onChange={(e) => {
                  const coupon = coupons.find((c) => c.code === e.target.value);
                  if (coupon) applyCoupon(coupon);
                  else setSelectedCoupon(null);
                }}
              />

              <PaymentInfo
                cart={cart}
                selectedCoupon={selectedCoupon}
                onPay={completeOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
