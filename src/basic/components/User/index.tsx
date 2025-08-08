import Card from "./components/Card";
import Coupon from "./components/Coupon";
import OrderInfo from "./components/OrderInfo";
import Cart from "./components/Cart";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: { quantity: number; rate: number }[];
  isRecommended?: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Coupon = {
  code: string;
  name: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type Totals = {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
};

type UserProps = {
  products: Product[];
  filteredProducts: Product[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product, cart: CartItem[]) => number;
  formatPrice: (price: number, id: string) => string;
  addToCart: (product: Product) => void;
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  totals: Totals;
  completeOrder: () => void;
};

export default function User(props: UserProps) {
  const {
    products,
    filteredProducts,
    debouncedSearchTerm,
    getRemainingStock,
    formatPrice,
    addToCart,
    cart,
    removeFromCart,
    updateQuantity,
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    totals,
    completeOrder,
  } = props;

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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const remainingStock = getRemainingStock(product, cart);

                return (
                  <Card
                    key={product.id}
                    product={product}
                    formatPrice={formatPrice}
                    remainingStock={remainingStock}
                    addToCart={addToCart}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />

          {cart.length > 0 && (
            <>
              <Coupon
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                applyCoupon={applyCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />
              <OrderInfo totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
