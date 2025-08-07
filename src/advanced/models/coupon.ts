import { Coupon } from "../../types";

export interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

// ============================================================================
// 내부 순수 함수
// ============================================================================

/**
 * 할인 적용 후 최종 금액 계산
 */
const applyDiscountToTotal = (total: number, discountAmount: number): number =>
  Math.max(0, total - discountAmount);

/**
 * percentage 쿠폰 최소 구매 금액 체크
 */
const checkMinimumPurchaseAmount = (
  total: number,
  minimumAmount: number = 10000
): boolean => total >= minimumAmount;

/**
 * 쿠폰 검증 실패 메시지 생성
 */
const generateValidationMessage = (
  discountType: "amount" | "percentage"
): string => {
  return discountType === "percentage"
    ? "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다."
    : "쿠폰을 사용할 수 없습니다.";
};

/**
 * 쿠폰 할인 금액 계산
 */
const calculateDiscountAmount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return Math.min(total, coupon.discountValue);
  } else {
    return total * (coupon.discountValue / 100);
  }
};

/**
 * 쿠폰 사용 가능 여부 확인
 */
export const isCouponUsageValid = (
  total: number,
  discountType: "amount" | "percentage"
): boolean => {
  if (discountType === "percentage") {
    return checkMinimumPurchaseAmount(total);
  }
  return true;
};

/**
 * 쿠폰 검증 실패 메시지 가져오기
 */
export const getCouponValidationMessage = (
  discountType: "amount" | "percentage"
): string => generateValidationMessage(discountType);

/**
 * 쿠폰 적용 가능 여부 검증
 */
export const validateCouponApplication = (
  total: number,
  coupon: Coupon
): { valid: boolean; message?: string } => {
  if (!isCouponUsageValid(total, coupon.discountType)) {
    return {
      valid: false,
      message: getCouponValidationMessage(coupon.discountType),
    };
  }
  return { valid: true };
};

/**
 * 쿠폰 할인 적용
 */
export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  const discountAmount = calculateDiscountAmount(total, coupon);
  return applyDiscountToTotal(total, discountAmount);
};

/**
 * 쿠폰 할인 금액 계산 (적용하지 않고 금액만 계산)
 */
export const calculateCouponDiscountAmount = (
  total: number,
  coupon: Coupon
): number => calculateDiscountAmount(total, coupon);

// ============================================================================
// 엔티티를 다루는 함수
// ============================================================================

/**
 * 빈 쿠폰 폼 생성
 */
export const createEmptyCouponForm = (): CouponFormData => ({
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
});

/**
 * 쿠폰 폼 초기화
 */
export const resetCouponForm = (): CouponFormData => createEmptyCouponForm();

/**
 * 쿠폰 폼에서 쿠폰 생성
 */
export const createCouponFromForm = (formData: CouponFormData): Coupon => ({
  name: formData.name,
  code: formData.code,
  discountType: formData.discountType,
  discountValue: formData.discountValue,
});

/**
 * 쿠폰 폼 제출 처리
 */
export const processCouponForm = (
  coupons: Coupon[],
  formData: CouponFormData
): { success: boolean; coupon?: Coupon; message: string } => {
  if (isDuplicateCouponCode(coupons, formData.code)) {
    return {
      success: false,
      message: "이미 존재하는 쿠폰 코드입니다.",
    };
  }

  const newCoupon = createCouponFromForm(formData);
  return {
    success: true,
    coupon: newCoupon,
    message: `쿠폰 "${newCoupon.name}"이(가) 생성되었습니다.`,
  };
};

/**
 * 쿠폰 코드 중복 확인
 */
export const isDuplicateCouponCode = (
  coupons: Coupon[],
  code: string
): boolean => coupons.some((coupon) => coupon.code === code);

/**
 * 쿠폰 목록에서 특정 쿠폰 제거
 */
export const removeCouponFromList = (
  coupons: Coupon[],
  couponCode: string
): Coupon[] => coupons.filter((coupon) => coupon.code !== couponCode);

/**
 * 쿠폰 목록에 새 쿠폰 추가
 */
export const addCouponToList = (
  coupons: Coupon[],
  newCoupon: Coupon
): Coupon[] => [...coupons, newCoupon];

/**
 * 쿠폰 코드로 쿠폰 찾기
 */
export const findCouponByCode = (
  coupons: Coupon[],
  code: string
): Coupon | undefined => coupons.find((coupon) => coupon.code === code);
