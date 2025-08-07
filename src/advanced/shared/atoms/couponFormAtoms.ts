import { atom } from 'jotai';
import type { Coupon as CouponType, CouponFormData as CouponFormDataType } from '../../../types';
import { DEFAULT_COUPON_FORM } from '../../constants/couponForm';
import {
  normalizeCode,
  updateFormDiscountType,
  parseDiscountValue,
  validateDiscountValue as validateDiscountValuePure,
  formToCoupon,
  resetCouponForm,
} from '../../models/couponForm';

/**
 * 쿠폰 폼 데이터 atom
 */
export const couponFormAtom = atom<CouponFormDataType>(DEFAULT_COUPON_FORM);

/**
 * 쿠폰 폼 표시 여부 atom
 */
export const showCouponFormAtom = atom<boolean>(false);

// === 파생 atoms (derived atoms) ===

/**
 * 쿠폰명 업데이트 액션 atom
 */
export const updateCouponNameAtom = atom(null, (get, set, name: string) => {
  const currentForm = get(couponFormAtom);
  set(couponFormAtom, { ...currentForm, name });
});

/**
 * 쿠폰 코드 업데이트 액션 atom
 */
export const updateCouponCodeAtom = atom(null, (get, set, code: string) => {
  const currentForm = get(couponFormAtom);
  set(couponFormAtom, { ...currentForm, code: normalizeCode(code) });
});

/**
 * 할인 타입 업데이트 액션 atom
 */
export const updateCouponDiscountTypeAtom = atom(null, (get, set, discountType: 'amount' | 'percentage') => {
  const currentForm = get(couponFormAtom);
  set(couponFormAtom, updateFormDiscountType(currentForm, discountType));
});

/**
 * 할인 값 업데이트 액션 atom
 */
export const updateCouponDiscountValueAtom = atom(null, (get, set, value: string) => {
  const parsedValue = parseDiscountValue(value);
  if (parsedValue !== null) {
    const currentForm = get(couponFormAtom);
    set(couponFormAtom, { ...currentForm, discountValue: parsedValue });
  }
});

/**
 * 할인 값 유효성 검증 액션 atom
 */
export const validateCouponDiscountValueAtom = atom(
  null,
  (get, set, value: string, onError: (message: string) => void) => {
    const currentForm = get(couponFormAtom);
    const validation = validateDiscountValuePure(Number(value), currentForm.discountType);

    if (!validation.isValid) {
      onError(validation.message);
    }

    set(couponFormAtom, { ...currentForm, discountValue: validation.correctedValue });
  },
);

/**
 * 쿠폰 폼 토글 액션 atom
 */
export const toggleCouponFormAtom = atom(null, (get, set) => {
  const currentShow = get(showCouponFormAtom);
  set(showCouponFormAtom, !currentShow);

  // 폼을 닫을 때 리셋
  if (currentShow) {
    set(couponFormAtom, resetCouponForm());
  }
});

/**
 * 쿠폰 폼 리셋 액션 atom
 */
export const resetCouponFormAtom = atom(null, (get, set) => {
  set(couponFormAtom, resetCouponForm());
  set(showCouponFormAtom, false);
});

/**
 * 쿠폰 폼 제출 액션 atom
 */
export const submitCouponFormAtom = atom(null, (get, set, onSubmit: (coupon: CouponType) => void) => {
  const currentForm = get(couponFormAtom);
  const couponData = formToCoupon(currentForm);

  onSubmit(couponData);

  // 폼 리셋
  set(couponFormAtom, resetCouponForm());
  set(showCouponFormAtom, false);
});
