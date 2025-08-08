import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { CartItem, Coupon } from "../../../types";
import { useNotification } from "../../___features/notification/use-notification";
import { useCoupons } from "../../___features/coupon/use-coupons";
import { useProducts } from "../../___features/product/use-products";
import { useDebounce } from "../../_shared/utility-hooks/use-debounce";
import GoToAdminButton from "./GoToAdmin";
import CartCount from "./cart/CartCount";
import SearchProductInput from "./SearchProductInput";
import Cart from "./cart/Cart";
import { useCart } from "../../___features/cart/use-cart";
import { sumMap } from "../../_shared/utility-func/sumMap";
import ListView from "./product/ListView";
import ProductCard from "./product/Product";

interface ShopPageProps {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

function ShopPage({ selectedCoupon, setSelectedCoupon }: ShopPageProps) {
  const { addNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { products } = useProducts({
    searchTerm: debouncedSearchTerm,
  });

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    resetCart,
    getCartProductQuantity,
  } = useCart();

  const { coupons } = useCoupons();

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const remainingStock = product.stock - getCartProductQuantity(productId);

    if (remainingStock <= 0) {
      addNotification({
        text: "재고가 부족합니다!",
        type: "error",
      });
      return;
    }

    if (remainingStock < quantity) {
      addNotification({
        text: `재고는 ${product.stock}개까지만 있습니다.`,
        type: "error",
      });
      return;
    }

    addToCart(product, quantity);
    addNotification({
      text: "장바구니에 담았습니다",
      type: "success",
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (product.stock < quantity) {
      addNotification({
        text: `재고는 ${product.stock}개까지만 있습니다.`,
        type: "error",
      });
      return;
    }

    updateQuantity(productId, quantity);
  };

  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  };

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification({
          text: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          type: "error",
        });
        return;
      }

      setSelectedCoupon(coupon);

      addNotification({
        text: "쿠폰이 적용되었습니다.",
        type: "success",
      });
    },
    [addNotification, calculateCartTotal]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;

    addNotification({
      text: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      type: "success",
    });
    resetCart();
    setSelectedCoupon(null);
  }, [addNotification]);

  const totals = calculateCartTotal();
  const totalItemCount = sumMap(cart, (item) => item.quantity);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              <div className="ml-8 flex-1 max-w-md">
                <SearchProductInput
                  searchTerm={searchTerm}
                  onChange={setSearchTerm}
                />
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <GoToAdminButton />
              <CartCount count={totalItemCount} />
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <section>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  전체 상품
                </h2>
                <div className="text-sm text-gray-600">
                  총 {products.length}개 상품
                </div>
              </div>

              <ListView
                list={products}
                renderItem={(product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClickCartButton={handleAddToCart}
                  />
                )}
                emptyView={
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                    </p>
                  </div>
                }
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              />
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={handleUpdateCartQuantity}
              />

              {cart.length > 0 && (
                <>
                  <section className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        쿠폰 할인
                      </h3>
                      <button className="text-xs text-blue-600 hover:underline">
                        쿠폰 등록
                      </button>
                    </div>
                    {coupons.length > 0 && (
                      <select
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={selectedCoupon?.code || ""}
                        onChange={(e) => {
                          const coupon = coupons.find(
                            (c) => c.code === e.target.value
                          );
                          if (coupon) applyCoupon(coupon);
                          else setSelectedCoupon(null);
                        }}
                      >
                        <option value="">쿠폰 선택</option>
                        {coupons.map((coupon) => (
                          <option key={coupon.code} value={coupon.code}>
                            {coupon.name} (
                            {coupon.discountType === "amount"
                              ? `${coupon.discountValue.toLocaleString()}원`
                              : `${coupon.discountValue}%`}
                            )
                          </option>
                        ))}
                      </select>
                    )}
                  </section>

                  <section className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">상품 금액</span>
                        <span className="font-medium">
                          {totals.totalBeforeDiscount.toLocaleString()}원
                        </span>
                      </div>
                      {totals.totalBeforeDiscount - totals.totalAfterDiscount >
                        0 && (
                        <div className="flex justify-between text-red-500">
                          <span>할인 금액</span>
                          <span>
                            -
                            {(
                              totals.totalBeforeDiscount -
                              totals.totalAfterDiscount
                            ).toLocaleString()}
                            원
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="font-semibold">결제 예정 금액</span>
                        <span className="font-bold text-lg text-gray-900">
                          {totals.totalAfterDiscount.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={completeOrder}
                      className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                    >
                      {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                    </button>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                      <p>* 실제 결제는 이루어지지 않습니다</p>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ShopPage;
