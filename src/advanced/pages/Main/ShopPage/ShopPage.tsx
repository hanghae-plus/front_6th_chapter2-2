import { CartContainer } from "../../../components/cart/CartContainer";
import { ProductList } from "../../../components/product/ProductList";
import { getRemainingStock } from "../../../utils/formatters";
import type { CartItem, Coupon, Product } from "../../../../types";

interface ShopPageProps {
  products: Product[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  searchInfo: {
    isSearching: boolean;
    searchTerm: string;
  };
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon, currentTotal: number) => void;
  onRemoveCoupon: () => void;
  onCompleteOrder: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ShopPage({
  products,
  cart,
  coupons,
  selectedCoupon,
  searchInfo,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onRemoveCoupon,
  onCompleteOrder,
  onAddToCart,
}: ShopPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <ProductList
            products={products}
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
