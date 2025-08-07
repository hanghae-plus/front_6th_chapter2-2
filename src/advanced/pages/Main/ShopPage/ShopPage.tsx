import { CartContainer } from "../../../components/cart/CartContainer";
import { ProductList } from "../../../components/product/ProductList";
import { getRemainingStock } from "../../../utils/formatters";
import { useAtomValue, useSetAtom } from "jotai";
import {
  cartAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
} from "../../../stores/cartStore";
import { couponsAtom, selectedCouponAtom, applyCouponAtom, setSelectedCouponAtom } from "../../../stores/couponStore";
import { productsAtom } from "../../../stores/productStore";
import { addNotificationAtom } from "../../../stores/notificationStore";
import type { Product, Coupon } from "../../../../types";

interface ShopPageProps {
  products: Product[];
  searchInfo: {
    isSearching: boolean;
    searchTerm: string;
  };
  onCompleteOrder: () => void;
}

export default function ShopPage({ products, searchInfo, onCompleteOrder }: ShopPageProps) {
  // Jotai atom에서 직접 값 가져오기
  const cart = useAtomValue(cartAtom);
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const allProducts = useAtomValue(productsAtom);

  // Jotai setter 함수들
  const addToCartSet = useSetAtom(addToCartAtom);
  const removeFromCartSet = useSetAtom(removeFromCartAtom);
  const updateQuantitySet = useSetAtom(updateQuantityAtom);
  const applyCouponSet = useSetAtom(applyCouponAtom);
  const setSelectedCouponSet = useSetAtom(setSelectedCouponAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);

  // 이벤트 핸들러들
  const handleAddToCart = (product: Product) => {
    try {
      addToCartSet(product);
      addNotificationSet({ message: "장바구니에 담았습니다.", type: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      addNotificationSet({ message: errorMessage, type: "error" });
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    try {
      removeFromCartSet(productId);
      addNotificationSet({ message: "장바구니에서 제거되었습니다.", type: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      addNotificationSet({ message: errorMessage, type: "error" });
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    try {
      updateQuantitySet({ productId, newQuantity: quantity, products: allProducts });
      addNotificationSet({ message: "수량이 업데이트되었습니다.", type: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      addNotificationSet({ message: errorMessage, type: "error" });
    }
  };

  const handleApplyCoupon = (coupon: Coupon, currentTotal: number) => {
    try {
      applyCouponSet({ coupon, currentTotal });
      addNotificationSet({ message: "쿠폰이 적용되었습니다.", type: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      addNotificationSet({ message: errorMessage, type: "error" });
    }
  };

  const handleRemoveCoupon = () => {
    setSelectedCouponSet(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <ProductList
            products={products}
            searchInfo={searchInfo}
            getRemainingStock={(product) => getRemainingStock(product, cart)}
            addToCart={handleAddToCart}
          />
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartContainer
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onCompleteOrder={onCompleteOrder}
          />
        </div>
      </div>
    </div>
  );
}
