import {
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
  useState,
} from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../hooks";

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

interface CouponContextType {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (newCoupon: Coupon) => void;
  updateCoupon: (couponCode: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (couponCode: string) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

const CouponContext = createContext<CouponContextType | null>(null);

export const CouponProvider = ({ children }: PropsWithChildren) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      setCoupons((prev) => [...prev, newCoupon]);
    },
    [setCoupons]
  );

  const updateCoupon = useCallback(
    (couponCode: string, updates: Partial<Coupon>) => {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.code === couponCode ? { ...coupon, ...updates } : coupon
        )
      );
    },
    [setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));
    },
    [setCoupons]
  );

  return (
    <CouponContext.Provider
      value={{
        coupons,
        selectedCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        setSelectedCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = (): CouponContextType => {
  const context = useContext(CouponContext);

  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }

  return context;
};
