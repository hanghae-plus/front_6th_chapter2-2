import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Coupon } from "../../types";
import { calculateCartTotal } from "../models/cart";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useCart } from "./useCart";
import { useNotificationActions } from "./useNotification";

type CouponContextTypes = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
};

interface CouponContextActionsTypes {
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  unapplyCoupon: () => void;
}

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const CouponContext = createContext<CouponContextTypes>({
  coupons: initialCoupons,
  selectedCoupon: null,
});

const CouponContextActions = createContext<CouponContextActionsTypes>({
  addCoupon: () => {},
  deleteCoupon: () => {},
  applyCoupon: () => {},
  unapplyCoupon: () => {},
});
const MIN_PURCHASE_FOR_PERCENTAGE = 10000;

export const CouponProvider = memo(({ children }: PropsWithChildren) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { addNotification } = useNotificationActions();
  const { cart } = useCart();

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find(
        (coupon) => coupon.code === newCoupon.code
      );

      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }

      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));

      if (selectedCoupon?.code === couponCode) {
        unapplyCoupon();
      }

      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

      if (
        currentTotal < MIN_PURCHASE_FOR_PERCENTAGE &&
        coupon.discountType === "percentage"
      ) {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart]
  );

  const unapplyCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const values = useMemo(
    () => ({
      coupons,
      selectedCoupon,
    }),
    [coupons, selectedCoupon]
  );

  const actions = useMemo(
    () => ({
      addCoupon,
      deleteCoupon,
      applyCoupon,
      unapplyCoupon,
    }),
    [addCoupon, deleteCoupon, applyCoupon, unapplyCoupon]
  );

  return (
    <CouponContext.Provider value={values}>
      <CouponContextActions.Provider value={actions}>
        {children}
      </CouponContextActions.Provider>
    </CouponContext.Provider>
  );
});

export const useCoupon = () => {
  const context = useContext(CouponContext);

  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }

  return context;
};

export const useCouponActions = () => {
  const context = useContext(CouponContextActions);

  if (!context) {
    throw new Error("useCouponActions must be used within a CouponProvider");
  }

  return context;
};
