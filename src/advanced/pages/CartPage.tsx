import ProductList from "../components/product/ProductList";
import Cart from "../components/cart/Cart";
import { useCart, useCoupon, useProduct, useSearch } from "../hooks";

export default function CartPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateItemTotal,
    getStockStatus,
    completeOrder,
  } = useCart();

  const { coupons, selectedCoupon, applyCoupon, clearSelectedCoupon } =
    useCoupon();

  const { products, searchProduct } = useProduct();
  const { debouncedSearchTerm } = useSearch();

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
