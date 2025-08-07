import { CartContainer } from "../../../components/cart/CartContainer";
import { ProductList } from "../../../components/product/ProductList";
import { getRemainingStock } from "../../../utils/formatters";
import { useProducts } from "../../../hooks/useProducts";
import { useCoupons } from "../../../hooks/useCoupons";
import { useSearch } from "../../../utils/hooks/useSearch";
import type { CartItem, Product } from "../../../../types";

interface ShopPageProps {
  cart: CartItem[];
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCompleteOrder: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ShopPage({
  cart,
  onRemoveFromCart,
  onUpdateQuantity,
  onCompleteOrder,
  onAddToCart,
}: ShopPageProps) {
  const { products } = useProducts();
  const { searchTerm, setSearchTerm, filteredProducts, searchInfo } = useSearch(products);

  // 쿠폰 관련 로직을 ShopPage에서 직접 관리
  const { coupons, selectedCoupon, applyCoupon, setSelectedCoupon } = useCoupons();

  // 쿠폰 적용 핸들러
  const handleApplyCoupon = (coupon: any, currentTotal: number) => {
    applyCoupon(coupon, currentTotal);
  };

  // 쿠폰 제거 핸들러
  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  // 주문 완료 핸들러 (쿠폰도 초기화)
  const handleCompleteOrder = () => {
    onCompleteOrder();
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
            addToCart={onAddToCart}
          />
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartContainer
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onRemoveFromCart={onRemoveFromCart}
            onUpdateQuantity={onUpdateQuantity}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onCompleteOrder={handleCompleteOrder}
          />
        </div>
      </div>
    </div>
  );
}
