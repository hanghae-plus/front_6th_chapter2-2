import { CartContainer } from "../../../components/cart/CartContainer";
import { ProductList } from "../../../components/product/ProductList";
import { getRemainingStock } from "../../../utils/formatters";
import { useProducts } from "../../../hooks/useProducts";
import { useSearch } from "../../../utils/hooks/useSearch";
import type { CartItem, Coupon, Product } from "../../../../types";

interface ShopPageProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon, currentTotal: number) => void;
  onRemoveCoupon: () => void;
  onCompleteOrder: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ShopPage({
  cart,
  coupons,
  selectedCoupon,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onRemoveCoupon,
  onCompleteOrder,
  onAddToCart,
}: ShopPageProps) {
  const { products } = useProducts();
  const { searchTerm, setSearchTerm, filteredProducts, searchInfo } = useSearch(products);

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
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
            onCompleteOrder={onCompleteOrder}
          />
        </div>
      </div>
    </div>
  );
}
