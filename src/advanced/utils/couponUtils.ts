import { Coupon } from "../../types";

/** 최소 할인 금액 설정 */
const MIN_PERCENTAGE_COUPON_AMOUNT = 10000;

/** 쿠폰 적용 가능 여부 검증 */
export const validateCouponApplication = (coupon: Coupon, currentTotal: number) => {
  if (currentTotal < MIN_PERCENTAGE_COUPON_AMOUNT && coupon.discountType === "percentage") {
    return false;
  }
  return true;
};

/** 쿠폰 코드 중복 검증 */
export const validateCouponCode = (newCoupon: Coupon, existingCoupons: Coupon[]) => {
  if (existingCoupons.find((c) => c.code === newCoupon.code)) {
    return false;
  }
  return true;
};

const MAX_PERCENTAGE = 100; // 최대 할인율 (%)
const MAX_DISCOUNT_AMOUNT = 100000; // 최대 할인 금액 (원)
const MIN_VALUE = 0; // 최소값
export const MAX_COUPON_NAME_LENGTH = 50; // 쿠폰명 최대 길이
export const MAX_COUPON_CODE_LENGTH = 20; // 쿠폰 코드 최대 길이

/** 할인 타입 옵션 */
export const DISCOUNT_TYPE_OPTIONS = [
  { value: "amount", label: "정액 할인" },
  { value: "percentage", label: "정률 할인" },
] as const;

/** 쿠폰 폼 검증 관련 */
export const validateDiscountValue = (value: number, discountType: "amount" | "percentage") => {
  if (discountType === "percentage") {
    // 할인율 검증 (0~100%)
    if (value > MAX_PERCENTAGE) {
      return {
        isValid: false,
        message: `할인율은 ${MAX_PERCENTAGE}%를 초과할 수 없습니다`,
        correctedValue: MAX_PERCENTAGE,
      };
    } else if (value < MIN_VALUE) {
      return {
        isValid: false,
        message: "",
        correctedValue: MIN_VALUE,
      };
    }
  } else {
    // 할인 금액 검증 (0~100,000원)
    if (value > MAX_DISCOUNT_AMOUNT) {
      return {
        isValid: false,
        message: `할인 금액은 ${MAX_DISCOUNT_AMOUNT.toLocaleString()}원을 초과할 수 없습니다`,
        correctedValue: MAX_DISCOUNT_AMOUNT,
      };
    } else if (value < MIN_VALUE) {
      return {
        isValid: false,
        message: "",
        correctedValue: MIN_VALUE,
      };
    }
  }
  return { isValid: true };
};

/** 쿠폰 폼 핸들러 관련 헬퍼 */
export const couponHandlers = {
  /** 할인값 입력 처리 (숫자만 허용) */
  processDiscountInput: (value: string): number | null => {
    // 빈 문자열이거나 순수 숫자만 허용
    if (value === "" || /^\d+$/.test(value)) {
      return value === "" ? MIN_VALUE : parseInt(value);
    }
    return null; // 유효하지 않은 입력
  },

  /** 할인 타입에 따른 UI 설정 반환 */
  getDiscountConfig: (discountType: "amount" | "percentage") => ({
    label: discountType === "amount" ? "할인 금액" : "할인율(%)",
    placeholder: discountType === "amount" ? "5000" : "10",
  }),
};
