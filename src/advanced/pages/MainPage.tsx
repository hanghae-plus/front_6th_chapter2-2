import { useAtom } from 'jotai';
import { Cart } from '../entities/cart/components/Cart';
import { Coupon } from '../entities/coupon/components/Coupon';
import { Payment } from '../entities/payment/components/Payment';
import { Product } from '../entities/product/components/Product';
import { cartAtom } from '../atoms';

export const MainPage = () => {
  const [cart] = useAtom(cartAtom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 섹션 */}
        <Product />
      </div>
      {/* 사이드바 - 장바구니 및 결제 정보 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 섹션 */}
          <Cart />
          {/* 쿠폰 및 결제 정보 (장바구니에 상품이 있을 때만 표시) */}
          {cart.length > 0 && (
            <>
              {/* 쿠폰 섹션 */}
              <Coupon />

              {/* 결제 정보 섹션 */}
              <Payment />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
