// 쿠폰 관련 비즈니스 로직 (순수 함수)
import { Coupon } from "../type/types";
import { isValidCouponCode } from "../utils/validators";

// 검증 함수들은 utils/validators.ts에서 import

/**
 * 쿠폰이 특정 총액에 적용 가능한지 확인합니다
 * @param coupon 확인할 쿠폰
 * @param totalAmount 적용하려는 총액
 * @returns 적용 가능하면 true, 그렇지 않으면 false
 */
export function canApplyCoupon(coupon: Coupon, totalAmount: number): boolean {
  // percentage 쿠폰은 10,000원 이상에서만 사용 가능
  if (coupon.discountType === "percentage" && totalAmount < 10000) {
    return false;
  }

  // amount 쿠폰은 할인 금액이 총액보다 작아야 함
  if (coupon.discountType === "amount" && coupon.discountValue >= totalAmount) {
    return false;
  }

  return true;
}

/**
 * 쿠폰을 적용한 할인 금액을 계산합니다
 * @param coupon 적용할 쿠폰
 * @param totalAmount 할인 전 총액
 * @returns 할인 금액
 */
export function calculateCouponDiscount(
  coupon: Coupon,
  totalAmount: number
): number {
  if (!canApplyCoupon(coupon, totalAmount)) {
    return 0;
  }

  if (coupon.discountType === "amount") {
    return Math.min(coupon.discountValue, totalAmount);
  } else {
    // percentage
    return Math.round(totalAmount * (coupon.discountValue / 100));
  }
}

/**
 * 쿠폰을 적용한 최종 금액을 계산합니다
 * @param coupon 적용할 쿠폰
 * @param totalAmount 할인 전 총액
 * @returns 할인 후 최종 금액
 */
export function applyCouponToAmount(
  coupon: Coupon,
  totalAmount: number
): number {
  const discount = calculateCouponDiscount(coupon, totalAmount);
  return Math.max(0, totalAmount - discount);
}

/**
 * 새로운 쿠폰을 생성합니다
 * @param couponData 쿠폰 생성 데이터
 * @returns 생성된 쿠폰 또는 null (유효하지 않은 경우)
 */
export function createCoupon(couponData: {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}): Coupon | null {
  const { name, code, discountType, discountValue } = couponData;

  // 필수 필드 검증
  if (!name.trim() || !code.trim()) {
    return null;
  }

  // 쿠폰 코드 형식 검증
  if (!isValidCouponCode(code)) {
    return null;
  }

  // 할인 값 검증
  if (discountValue <= 0) {
    return null;
  }

  // percentage 타입의 경우 100% 이하여야 함
  if (discountType === "percentage" && discountValue > 100) {
    return null;
  }

  return {
    name: name.trim(),
    code: code.trim().toUpperCase(),
    discountType,
    discountValue,
  };
}

/**
 * 쿠폰 목록에서 특정 코드의 쿠폰을 찾습니다
 * @param coupons 쿠폰 목록
 * @param code 찾을 쿠폰 코드
 * @returns 찾은 쿠폰 또는 undefined
 */
export function findCouponByCode(
  coupons: Coupon[],
  code: string
): Coupon | undefined {
  return coupons.find((coupon) => coupon.code === code.toUpperCase());
}

/**
 * 쿠폰 목록에 중복된 코드가 있는지 확인합니다
 * @param coupons 기존 쿠폰 목록
 * @param code 확인할 쿠폰 코드
 * @returns 중복되면 true, 그렇지 않으면 false
 */
export function isDuplicateCouponCode(
  coupons: Coupon[],
  code: string
): boolean {
  return coupons.some((coupon) => coupon.code === code.toUpperCase());
}

/**
 * 쿠폰 목록에서 특정 코드의 쿠폰을 제거합니다
 * @param coupons 기존 쿠폰 목록
 * @param code 제거할 쿠폰 코드
 * @returns 쿠폰이 제거된 새로운 배열
 */
export function removeCouponByCode(coupons: Coupon[], code: string): Coupon[] {
  return coupons.filter((coupon) => coupon.code !== code.toUpperCase());
}

/**
 * 쿠폰 목록에 새로운 쿠폰을 추가합니다
 * @param coupons 기존 쿠폰 목록
 * @param coupon 추가할 쿠폰
 * @returns 쿠폰이 추가된 새로운 배열 또는 null (중복 코드인 경우)
 */
export function addCouponToCoupons(
  coupons: Coupon[],
  coupon: Coupon
): Coupon[] | null {
  if (isDuplicateCouponCode(coupons, coupon.code)) {
    return null;
  }

  return [...coupons, coupon];
}
