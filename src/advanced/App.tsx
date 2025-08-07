import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Coupon } from "../types";
import { Header } from "./components/common/Header";
import { NotificationToast } from "./components/common/NotificationToast";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import { useFilteredProducts } from "./utils/hooks/useFilteredProducts";
import { useDebounce } from "./utils/hooks/useDebounce";
import { NOTIFICATION_MESSAGE } from "./constants";
import { cartHandler } from "./handlers/cart";
import { isAdminAtom } from "./atoms/admin";
import { searchTermAtom } from "./atoms/search";
import { addNotificationAtom } from "./atoms/notification";
import { selectedCouponAtom } from "./atoms/selectedCoupon";
import { cartWithLocalStorageAtom } from "./atoms/cart";
import { productsWithLocalStorageAtom } from "./atoms/products";
import {
  hasCouponAtom,
  addCouponAtom,
  deleteCouponAtom,
  applyCouponAtom,
} from "./atoms/coupons";

export default function App() {
  const searchTerm = useAtomValue(searchTermAtom);
  const cart = useAtomValue(cartWithLocalStorageAtom);
  const hasCoupon = useAtomValue(hasCouponAtom);
  const addCouponAction = useSetAtom(addCouponAtom);
  const deleteCouponAction = useSetAtom(deleteCouponAtom);
  const applyCouponAction = useSetAtom(applyCouponAtom);

  const selectedCoupon = useAtomValue(selectedCouponAtom);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const addNotification = useSetAtom(addNotificationAtom);
  const products = useAtomValue(productsWithLocalStorageAtom);

  const filteredProducts = useFilteredProducts(products, debouncedSearchTerm);

  const [isAdmin] = useAtom(isAdminAtom);

  const {
    calculateItemTotal,
    calculateCartTotal,
    updateCartItemQuantity,
    getRemainingStock,
  } = cartHandler(cart, selectedCoupon);

  const handleDeleteCoupon = (couponCode: string) => {
    deleteCouponAction(couponCode);
    addNotification({
      message: NOTIFICATION_MESSAGE.COUPON.DELETE,
      type: "success",
    });
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    const isSuccessAddCoupon = addCouponAction({
      newCoupon,
      isCouponExists: hasCoupon(newCoupon.code),
    });
    if (isSuccessAddCoupon) {
      addNotification({
        message: NOTIFICATION_MESSAGE.COUPON.ADD,
        type: "success",
      });
    } else {
      addNotification({
        message: NOTIFICATION_MESSAGE.ERROR.EXISTED_COUPON,
        type: "error",
      });
    }
  };

  const handleApplyCoupon = (coupon: Coupon, currentTotal: number) => {
    const canApplyCoupon = applyCouponAction({ coupon, currentTotal });
    if (canApplyCoupon) {
      addNotification({
        message: NOTIFICATION_MESSAGE.COUPON.APPLIED,
        type: "success",
      });
    } else {
      addNotification({
        message: NOTIFICATION_MESSAGE.ERROR.MIN_COUPON,
        type: "error",
      });
    }
  };
  const totals = calculateCartTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            handleAddCoupon={handleAddCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
            getRemainingStock={getRemainingStock}
          />
        ) : (
          <CartPage
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            handleApplyCoupon={handleApplyCoupon}
            totals={totals}
            getRemainingStock={getRemainingStock}
            updateCartItemQuantity={updateCartItemQuantity}
            calculateItemTotal={calculateItemTotal}
          />
        )}
      </main>
    </div>
  );
}
