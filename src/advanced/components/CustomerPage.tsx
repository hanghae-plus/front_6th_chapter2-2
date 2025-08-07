import { useCarts } from '../storeHooks/useCarts';
import { useCoupons } from '../storeHooks/useCoupons';
import { useProducts } from '../storeHooks/useProducts';
import { useCartCalculations } from '../hooks/useCartCalculations';
import { useCartActions } from '../hooks/useCartActions';
import ProductList from './customer/ProductList';
import Cart from './customer/Cart';
import CouponSection from './customer/CouponSection';
import CheckoutSection from './customer/CheckoutSection';
import { useSearch, useNotifications } from '../store/hooks';

const CustomerPage = () => {
  const { debouncedSearchTerm } = useSearch();

  const { products } = useProducts();
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useCarts();
  const { coupons, selectedCoupon, setSelectedCoupon } = useCoupons();

  const { calculateItemTotal, getRemainingStock, totals } = useCartCalculations(cart, selectedCoupon);

  const { handleAddToCart, updateQuantity, applyCoupon, completeOrder } = useCartActions({
    products,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setSelectedCoupon,
    getRemainingStock,
    totals
  });

  // 검색어로 상품 필터링
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        product =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductList
        products={products}
        filteredProducts={filteredProducts}
        debouncedSearchTerm={debouncedSearchTerm}
        getRemainingStock={getRemainingStock}
        onAddToCart={handleAddToCart}
      />

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            cart={cart}
            calculateItemTotal={calculateItemTotal}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />

          {cart.length > 0 && (
            <>
              <CouponSection
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={() => setSelectedCoupon(null)}
              />

              <CheckoutSection totals={totals} onCompleteOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
