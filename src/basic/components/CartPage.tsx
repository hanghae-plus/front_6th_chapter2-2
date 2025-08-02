import { CartItem, Coupon, ProductWithUI } from "../types";
import ProductCard from "./ProductCard";
import Cart from "./Cart";

interface CartPageProps {
  // 상품 관련
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: ProductWithUI) => number;
  onAddToCart: (product: ProductWithUI) => void;

  // 장바구니 관련
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
  calculateItemTotal: (item: CartItem) => number;
}

const CartPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  onAddToCart,
  cart,
  coupons,
  selectedCoupon,
  totals,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onCompleteOrder,
  calculateItemTotal,
}: CartPageProps) => {
  return (
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
                  remainingStock={getRemainingStock(product)}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          totals={totals}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateQuantity={onUpdateQuantity}
          onApplyCoupon={onApplyCoupon}
          onCompleteOrder={onCompleteOrder}
          calculateItemTotal={calculateItemTotal}
        />
      </div>
    </div>
  );
};

export default CartPage;
