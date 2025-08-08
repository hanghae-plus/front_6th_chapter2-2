import { CartContainer } from "../../components/cart/CartContainer";
import { ProductList } from "../../components/product/ProductList";
import { useSetAtom } from "jotai";
import { addNotificationAtom } from "../../stores/notificationStore";
import { filterSearchTermByProduct } from "../../models/product";
import { useMemo } from "react";

// hooks
import { useProducts } from "../../hooks/useProducts";
import { useCoupons } from "../../hooks/useCoupons";
import { useCart } from "../../hooks/useCart";

interface ShopPageProps {
  searchTerm: string;
}

export default function ShopPage({ searchTerm }: ShopPageProps) {
  // 훅들을 사용하여 상태와 함수들을 가져옴
  const { products } = useProducts();
  const { coupons, selectedCoupon, applyCoupon, setSelectedCoupon, deleteCoupon } = useCoupons();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getRemainingStock } = useCart();

  // 검색된 상품들
  const filteredProducts = useMemo(() => {
    return filterSearchTermByProduct(products, searchTerm);
  }, [products, searchTerm]);

  // 검색 상태 정보
  const searchInfo = useMemo(
    () => ({
      isSearching: Boolean(searchTerm.trim()),
      searchTerm,
      resultCount: filteredProducts.length,
      totalCount: products.length,
      hasResults: filteredProducts.length > 0,
    }),
    [searchTerm, filteredProducts.length, products.length]
  );

  // 알림 함수
  const addNotificationSet = useSetAtom(addNotificationAtom);

  const handleCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotificationSet({ message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`, type: "success" });
    clearCart();
    setSelectedCoupon(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <ProductList
            products={filteredProducts}
            searchInfo={searchInfo}
            getRemainingStock={getRemainingStock}
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
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={() => deleteCoupon(selectedCoupon?.code ?? "")}
            onCompleteOrder={handleCompleteOrder}
          />
        </div>
      </div>
    </div>
  );
}
