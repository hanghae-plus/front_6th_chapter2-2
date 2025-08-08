import { useEffect } from "react";
import { CartContainer } from "../../components/cart/CartContainer";
import { ProductList } from "../../components/product/ProductList";
import { getRemainingStock } from "../../utils/formatters";
import { useProducts } from "../../hooks/useProducts";
import { useCoupons } from "../../hooks/useCoupons";
import { useCart } from "../../hooks/useCart";
import { useOrder } from "../../hooks/useOrder";
import { useSearch } from "../../utils/hooks/useSearch";
import type { Coupon } from "../../../types";

interface ShopPageProps {
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
  onTotalItemCountChange?: (count: number) => void;
}

export default function ShopPage({ addNotification, onTotalItemCountChange }: ShopPageProps) {
  const { products } = useProducts();
  const { searchTerm, setSearchTerm, filteredProducts, searchInfo } = useSearch(products);

  const { coupons, selectedCoupon, applyCoupon, setSelectedCoupon } = useCoupons(addNotification);

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItemCount } = useCart(addNotification);

  const { completeOrder } = useOrder({ clearCart, addNotification });

  // totalItemCount가 변경될 때마다 부모에게 알림
  useEffect(() => {
    onTotalItemCountChange?.(totalItemCount);
  }, [totalItemCount, onTotalItemCountChange]);

  // 쿠폰 적용 핸들러
  const handleApplyCoupon = (coupon: Coupon, currentTotal: number) => {
    applyCoupon(coupon, currentTotal);
  };

  // 쿠폰 제거 핸들러
  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  // 주문 완료 핸들러 (쿠폰도 초기화)
  const handleCompleteOrder = () => {
    completeOrder();
    setSelectedCoupon(null); // 주문 완료 시 쿠폰도 초기화
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          {/* 검색 입력 필드 */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="상품 검색..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <ProductList
            products={filteredProducts}
            searchInfo={searchInfo}
            getRemainingStock={(product) => getRemainingStock(product, cart)}
            addToCart={addToCart}
          />
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartContainer
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onCompleteOrder={handleCompleteOrder}
          />
        </div>
      </div>
    </div>
  );
}
