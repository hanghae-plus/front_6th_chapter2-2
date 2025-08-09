import { Coupon } from "../../types";

// 초기 쿠폰 데이터
export const initialCoupons: Coupon[] = [
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

// 쿠폰 폼 초기 상태
export const COUPON_FORM_INITIAL_STATE = {
  name: "",
  code: "",
  discountType: "amount" as "amount" | "percentage",
  discountValue: 0,
};

// 쿠폰 검증 규칙
export const COUPON_VALIDATION_RULES = {
  MIN_AMOUNT_DISCOUNT: 1000,
  MAX_AMOUNT_DISCOUNT: 100000,
  MIN_PERCENTAGE_DISCOUNT: 1,
  MAX_PERCENTAGE_DISCOUNT: 100,
  MIN_CART_TOTAL_FOR_PERCENTAGE: 10000,
};

// 쿠폰 타입별 최대값
export const COUPON_LIMITS = {
  amount: {
    min: 1000,
    max: 100000,
  },
  percentage: {
    min: 1,
    max: 100,
  },
};
