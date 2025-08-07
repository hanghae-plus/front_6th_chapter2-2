import { CartContainer } from "../../../components/cart/CartContainer";
import { ProductList } from "../../../components/product/ProductList";
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
import { searchProducts } from "../../../models/product";
import { getRemainingStock } from "../../../models/cart";
import { useMemo } from "react";
import { withTryNotifySuccess } from "../../../utils/withNotify";
import type { Product, Coupon } from "../../../../types";

interface ShopPageProps {
  searchTerm: string;
}

export default function ShopPage({ searchTerm }: ShopPageProps) {
  const products = useAtomValue(productsAtom);
  const cart = useAtomValue(cartAtom);
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);

  // 검색된 상품들
  const filteredProducts = useMemo(() => {
    return searchProducts(products, searchTerm);
  }, [products, searchTerm]);

  // 검색 상태 정보
  const searchInfo = useMemo(
    () => ({
      isSearching: Boolean(searchTerm.trim()),
      searchTerm,
      resultCount: filteredProducts.length,
      totalCount: products.length,
      hasResults: filteredProducts.length > 0,
    }),
    [searchTerm, filteredProducts.length, products.length]
  );

  // Jotai setter 함수들
  const addToCartSet = useSetAtom(addToCartAtom);
  const removeFromCartSet = useSetAtom(removeFromCartAtom);
  const updateQuantitySet = useSetAtom(updateQuantityAtom);
  const applyCouponSet = useSetAtom(applyCouponAtom);
  const setSelectedCouponSet = useSetAtom(setSelectedCouponAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);
  const clearCartSet = useSetAtom(clearCartAtom);

  // 이벤트 핸들러들
  const handleAddToCart = withTryNotifySuccess(
    (product: Product) => addToCartSet(product),
    "장바구니에 담았습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleRemoveFromCart = withTryNotifySuccess(
    (productId: string) => removeFromCartSet(productId),
    "장바구니에서 제거되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleUpdateQuantity = withTryNotifySuccess(
    (productId: string, quantity: number) => updateQuantitySet({ productId, newQuantity: quantity, products }),
    "수량이 업데이트되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleApplyCoupon = withTryNotifySuccess(
    (coupon: Coupon, currentTotal: number) => applyCouponSet({ coupon, currentTotal }),
    "쿠폰이 적용되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleRemoveCoupon = withTryNotifySuccess(
    () => setSelectedCouponSet(null),
    "쿠폰이 제거되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotificationSet({ message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`, type: "success" });
    clearCartSet();
    setSelectedCouponSet(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <ProductList
            products={filteredProducts}
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
            onCompleteOrder={handleCompleteOrder}
          />
        </div>
      </div>
    </div>
  );
}
