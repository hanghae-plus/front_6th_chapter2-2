import { Coupon, DiscountType } from "../../../../types";
import { useLocalStorageObject } from "../../../shared/hooks/useLocalStorage";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: DiscountType.AMOUNT,
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
  },
];

export function useCouponStorage() {
  const [coupons, setCoupons] = useLocalStorageObject<Coupon[]>(
    "coupons",
    initialCoupons
  );

  return {
    coupons,
    setCoupons,
  };
}
