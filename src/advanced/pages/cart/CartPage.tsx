import CartListSection from "./components/CartListSection";
import CouponSection from "./components/CouponSection";
import PaymentSection from "./components/PaymentSection";
import ProductSection from "./components/ProductSection";

const CartPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductSection />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 목록 */}
          <CartListSection />

          {/* 쿠폰 선택 */}
          <CouponSection />

          {/* 결제 정보 */}
          <PaymentSection />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
