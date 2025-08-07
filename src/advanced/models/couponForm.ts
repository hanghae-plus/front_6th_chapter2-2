import type { Coupon as CouponType } from '../../types';
import type { CouponFormData as CouponFormDataType } from '../../types';
import { DEFAULT_COUPON_FORM } from '../constants/couponForm';
import { validator } from '../shared/utils/validators';

/**
 * 쿠폰 코드를 대문자로 변환하는 순수함수
 * @param code - 입력된 코드
 * @returns 대문자로 변환된 코드
 */
export const normalizeCode = (code: string): string => code.toUpperCase();

/**
 * 할인 타입 변경 시 새로운 폼 상태를 반환하는 순수함수
 * @param currentForm - 현재 폼 상태
 * @param discountType - 새로운 할인 타입
 * @returns 업데이트된 폼 상태
 */
export const updateFormDiscountType = (
  currentForm: CouponFormDataType,
  discountType: 'amount' | 'percentage',
): CouponFormDataType => ({
  ...currentForm,
  discountType,
  discountValue: 0,
});

/**
 * 입력된 값을 숫자로 파싱하는 순수함수
 * @param value - 입력 문자열
 * @returns 파싱된 숫자 값 또는 null (유효하지 않은 경우)
 */
export const parseDiscountValue = (value: string): number | null => {
  const numericString = validator.validateNumericString(value);
  if (numericString === null) return null;
  return numericString === '' ? 0 : parseInt(numericString);
};

/**
 * 할인 값 유효성 검증하는 순수함수
 * @param value - 검증할 값
 * @param discountType - 할인 타입
 * @returns 검증 결과 객체
 */
export const validateDiscountValue = (
  value: number,
  discountType: 'amount' | 'percentage',
): { isValid: boolean; message: string; correctedValue: number } => {
  const isPercentageType = discountType === 'percentage';

  return isPercentageType ? validator.isValidDiscountPercentage(value) : validator.isValidDiscountAmount(value);
};

/**
 * 폼 데이터를 쿠폰 객체로 변환하는 순수함수
 * @param formData - 폼 데이터
 * @returns 쿠폰 객체
 */
export const formToCoupon = (formData: CouponFormDataType): CouponType => ({
  name: formData.name,
  code: formData.code,
  discountType: formData.discountType,
  discountValue: formData.discountValue,
});

/**
 * 폼을 기본값으로 리셋하는 순수함수
 * @returns 기본 폼 상태
 */
export const resetCouponForm = (): CouponFormDataType => ({ ...DEFAULT_COUPON_FORM });
