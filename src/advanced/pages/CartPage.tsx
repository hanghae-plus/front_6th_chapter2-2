import ProductList from "../components/product/ProductList";
import CartList from "../components/cart/CartList";
import CouponSelector from "../components/coupon/CouponSelector";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import { useCoupons } from "../hooks/useCoupons";

const CartPage = () => {
  const { products } = useProducts();
  const { cart } = useCart();
  const { coupons } = useCoupons();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList products={products} />
      </div>

      {/* 장바구니 + 결제 정보 컨테이너 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 */}
          <CartList cart={cart} />

          {cart.length > 0 && (
            <>
              {/* 쿠폰 선택 */}
              <CouponSelector coupons={coupons} />

              {/* 결제 정보 */}
              <OrderSummary />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
