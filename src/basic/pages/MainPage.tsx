import { Dispatch, SetStateAction } from 'react';
import { CartItemType, CouponType } from '@/types';
import { ProductWithUI } from '../entities/product/types/product';
import { Cart } from '../entities/cart/components/Cart';
import { Coupon } from '../entities/coupon/components/Coupon';
import { Payment } from '../features/payment/components/Payment';
import { Product } from '../entities/product/components/Product';
import { useCart } from '../entities/cart';
import { useCoupon } from '../entities/coupon';

interface MainPagePropsType {
  products: ProductWithUI[];
  cart: CartItemType[];
  setCart: Dispatch<SetStateAction<CartItemType[]>>;
  coupons: CouponType[];
  setCoupons: Dispatch<SetStateAction<CouponType[]>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string;
  addNotification: (message: string, type: 'success' | 'error') => void;
}

export const MainPage = ({
  products,
  cart,
  setCart,
  coupons,
  setCoupons,
  debouncedSearchTerm,
  addNotification,
}: MainPagePropsType) => {
  const { addToCart, removeFromCart, updateQuantity } = useCart({
    products,
    addNotification,
    cart,
    setCart,
  });

  const { selectedCoupon, setSelectedCoupon } = useCoupon({
    coupons,
    setCoupons,
    addNotification,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 섹션 */}
        <Product
          products={products}
          debouncedSearchTerm={debouncedSearchTerm}
          addToCart={addToCart}
          isAdmin={false}
          cart={cart}
        />
      </div>
      {/* 사이드바 - 장바구니 및 결제 정보 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 섹션 */}
          <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
          {/* 쿠폰 및 결제 정보 (장바구니에 상품이 있을 때만 표시) */}
          {cart.length > 0 && (
            <>
              {/* 쿠폰 섹션 */}
              <Coupon
                cart={cart}
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />

              {/* 결제 정보 섹션 */}
              <Payment
                addNotification={addNotification}
                setCart={setCart}
                setSelectedCoupon={setSelectedCoupon}
                cart={cart}
                selectedCoupon={selectedCoupon}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
