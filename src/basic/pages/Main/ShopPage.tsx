import { useEffect } from "react";

// components
import { CartContainer } from "../../components/cart/CartContainer";
import { ProductList } from "../../components/product/ProductList";

// hooks
import { useProducts } from "../../hooks/useProducts";
import { useCoupons } from "../../hooks/useCoupons";
import { useCart } from "../../hooks/useCart";
import { useOrder } from "../../hooks/useOrder";

// utils
import { getRemainingStock } from "../../utils/formatters";
import { useSearch } from "../../utils/hooks/useSearch";

// types
import type { Coupon } from "../../../types";

interface ShopPageProps {
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
  onTotalItemCountChange?: (count: number) => void;
  searchTerm: string;
}

export default function ShopPage({ addNotification, onTotalItemCountChange, searchTerm }: ShopPageProps) {
  const { products } = useProducts();
  const { filteredProducts, searchInfo } = useSearch(products, { externalSearchTerm: searchTerm });

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
