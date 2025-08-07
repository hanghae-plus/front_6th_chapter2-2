import { CartContainer } from "../../../components/cart/CartContainer";
import { ProductList } from "../../../components/product/ProductList";
import { CartItem, Coupon, Product } from "../../../../types";
import { getRemainingStock } from "../../../utils/formatters";

interface ShopPageProps {
  products: Product[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  searchInfo: {
    isSearching: boolean;
    searchTerm: string;
  };
  calculateItemTotal: (item: CartItem) => number;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  onCompleteOrder: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ShopPage({
  products,
  cart,
  coupons,
  selectedCoupon,
  totals,
  searchInfo,
  calculateItemTotal,
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
            totalBeforeDiscount={totals.totalBeforeDiscount}
            totalAfterDiscount={totals.totalAfterDiscount}
            calculateItemTotal={calculateItemTotal}
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
