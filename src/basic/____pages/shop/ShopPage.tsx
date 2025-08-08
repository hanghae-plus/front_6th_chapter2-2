import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CartItem, Coupon, Product } from "../../../types";
import { useNotification } from "../../___features/notification/use-notification";
import { useCoupons } from "../../___features/coupon/use-coupons";
import { useProducts } from "../../___features/product/use-products";
import { useDebounce } from "../../_shared/utility-hooks/use-debounce";
import { useLocalStorage } from "../../_shared/utility-hooks/use-local-storage";
import GoToAdminButton from "./GoToAdmin";
import CartCount from "./cart/CartCount";
import SearchProductInput from "./SearchProductInput";
import ProductListSection from "./product/ProductListSection";
import Cart from "./cart/Cart";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface ShopPageProps {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

function ShopPage({ selectedCoupon, setSelectedCoupon }: ShopPageProps) {
  const { addNotification } = useNotification();

  const [cart, setCart, removeCart] = useLocalStorage<CartItem[]>("cart", []);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      removeCart();
    }
  }, [cart, removeCart]);

  const { coupons } = useCoupons();
  const { products } = useProducts({
    searchTerm: debouncedSearchTerm,
  });

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification({
          text: "재고가 부족합니다!",
          type: "error",
        });
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification({
              text: `재고는 ${product.stock}개까지만 있습니다.`,
              type: "error",
            });
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification({
        text: "장바구니에 담았습니다",
        type: "success",
      });
    },
    [cart, addNotification, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

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

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification({
          text: `재고는 ${maxStock}개까지만 있습니다.`,
          type: "error",
        });
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification]
  );

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
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const totals = calculateCartTotal();

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
            <ProductListSection
              searchTerm={debouncedSearchTerm}
              getRemainingStock={getRemainingStock}
              addToCart={addToCart}
            />
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
