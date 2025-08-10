import { ProductWithUI } from "../App";
import { CartItem } from "../../types";
import { Coupon } from "../../types";
import ProductList from "../components/product/ProductList";
import Cart from "../components/cart/Cart";

interface CartPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  searchTerm: string;
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateItemTotal: (item: CartItem, cart: CartItem[]) => number;
  applyCoupon: (coupon: Coupon) => void;
  clearSelectedCoupon: () => void;
  completeOrder: () => void;
  searchProduct: (searchTerm: string) => ProductWithUI[];
  getStockStatus: (
    product: ProductWithUI,
    cart: CartItem[]
  ) => { remainingStock: number; isLowStock: boolean; isOutOfStock: boolean };
}

export default function CartPage({
  products,
  cart,
  coupons,
  selectedCoupon,
  debouncedSearchTerm,
  addToCart,
  removeFromCart,
  updateQuantity,
  calculateItemTotal,
  applyCoupon,
  clearSelectedCoupon,
  completeOrder,
  searchProduct,
  getStockStatus,
}: CartPageProps) {
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
          <ProductList
            cart={cart}
            products={products}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={addToCart}
            searchProduct={searchProduct}
            getStockStatus={getStockStatus}
          />
        </section>
      </div>

      <div className="lg:col-span-1">
        {/* 장바구니 */}
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          calculateItemTotal={calculateItemTotal}
          applyCoupon={applyCoupon}
          clearSelectedCoupon={clearSelectedCoupon}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
}
