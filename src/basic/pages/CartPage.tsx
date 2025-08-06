import { ProductWithUI } from "../entities/products/product.types";
import { CartItem, Coupon } from "../../types";
import { calculateItemTotal } from "../utils/calculateItemTotal";
import { ProductListSection } from "../components/ui/cart/ProductListSection";
import { CartSection } from "../components/ui/cart/CartSection";
import { CouponSection } from "../components/ui/cart/CouponSection";

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  checkSoldOutByProductId: (productId: string) => boolean;
  isAdmin: boolean;
  // Cart 관련 props
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  // Coupon 관련 props
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon, cart: CartItem[]) => void;
  // Order 관련 props
  completeOrder: () => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

export const CartPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  cart,
  checkSoldOutByProductId,
  isAdmin,
  addToCart,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  completeOrder,
  totals,
}: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductListSection
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          cart={cart}
          checkSoldOutByProductId={checkSoldOutByProductId}
          isAdmin={isAdmin}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSection
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />

          {cart.length > 0 && (
            <>
              <CouponSection
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                applyCoupon={applyCoupon}
                cart={cart}
              />

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
                          totals.totalBeforeDiscount - totals.totalAfterDiscount
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
  );
};
