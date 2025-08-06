import {
  CartItem as CartItemType,
  Coupon,
  Product,
  ProductWithUI,
} from "@/types/product.type";
import CartItem from "./CartItem";
import CheckoutSection from "./CheckoutSection";
import CouponSection from "./CouponSection";
import ProductCard from "./product-card";
type Props = {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: Product) => void;
  cart: CartItemType[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  calculateItemTotal: (item: CartItemType) => number;
};

const ProductList = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  formatPrice,
  addToCart,
  cart,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCoupon,
  applyCoupon,
  totals,
  completeOrder,
  setSelectedCoupon,
  calculateItemTotal,
}: Props) => {
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
                  <ProductCard
                    product={product}
                    remainingStock={remainingStock}
                    formatPrice={formatPrice}
                    addToCart={addToCart}
                  />
                );
              })}
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
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemTotal = calculateItemTotal(item);
                  const originalPrice = item.product.price * item.quantity;
                  const hasDiscount = itemTotal < originalPrice;
                  const discountRate = hasDiscount
                    ? Math.round((1 - itemTotal / originalPrice) * 100)
                    : 0;

                  return (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                      hasDiscount={hasDiscount}
                      discountRate={discountRate}
                      itemTotal={itemTotal}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <CouponSection
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                applyCoupon={applyCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />

              <CheckoutSection totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
