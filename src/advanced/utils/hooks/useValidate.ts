import { useCallback } from 'react';
import {
  getDiscountRateDisplay,
  getDisplayValue,
  isValidNumberFormat,
  normalizeCouponCode,
  normalizeCouponDiscountValue,
  normalizeCouponDiscountValueWithLimits,
  normalizeDiscountRateInput,
  normalizePriceInput,
  normalizeStockInput,
  validateCouponCode,
  validateCouponDiscountValue,
  validateCouponName,
  validateDiscountRate,
  validatePrice,
  validatePriceIndividual as validatePriceIndividualFn,
  validateStock,
  validateStockIndividual as validateStockIndividualFn,
  type ValidationResult,
} from '../validators';

// 가격 검증 훅
export function useValidatePrice() {
  const validatePriceValue = useCallback((price: number): ValidationResult => {
    return validatePrice({ price });
  }, []);

  const validatePriceInput = useCallback((value: string): boolean => {
    return isValidNumberFormat({ value });
  }, []);

  const normalizePrice = useCallback((value: string): number => {
    return normalizePriceInput({ value });
  }, []);

  const validatePriceIndividual = useCallback(
    (price: number): { isValid: boolean; errorMessage?: string } => {
      return validatePriceIndividualFn({ price });
    },
    []
  );

  return {
    validatePrice: validatePriceValue,
    validatePriceInput,
    normalizePrice,
    validatePriceIndividual,
  };
}

// 재고 검증 훅
export function useValidateStock() {
  const validateStockValue = useCallback((stock: number): ValidationResult => {
    return validateStock({ stock });
  }, []);

  const validateStockInput = useCallback((value: string): boolean => {
    return isValidNumberFormat({ value });
  }, []);

  const normalizeStock = useCallback((value: string): number => {
    return normalizeStockInput({ value });
  }, []);

  const validateStockIndividual = useCallback(
    (
      stock: number
    ): { isValid: boolean; errorMessage?: string; correctedValue?: number } => {
      return validateStockIndividualFn({ stock });
    },
    []
  );

  return {
    validateStock: validateStockValue,
    validateStockInput,
    normalizeStock,
    validateStockIndividual,
  };
}

// 할인율 검증 훅
export function useValidateDiscountRate() {
  const validateRate = useCallback((rate: number): ValidationResult => {
    return validateDiscountRate({ rate });
  }, []);

  const normalizeRate = useCallback((value: string): number => {
    return normalizeDiscountRateInput({ value });
  }, []);

  return {
    validateRate,
    normalizeRate,
  };
}

// 표시용 값 변환 훅
export function useDisplayValues() {
  const getDisplayValueFn = useCallback((value: number): string => {
    return getDisplayValue({ value });
  }, []);

  const getDiscountRateDisplayFn = useCallback((rate: number): number => {
    return getDiscountRateDisplay({ rate });
  }, []);

  return {
    getDisplayValue: getDisplayValueFn,
    getDiscountRateDisplay: getDiscountRateDisplayFn,
  };
}

// 통합 검증 훅
export function useProductFormValidation() {
  const validatePrice = useValidatePrice();
  const validateStock = useValidateStock();
  const validateRate = useValidateDiscountRate();
  const displayValues = useDisplayValues();

  return {
    validatePrice,
    validateStock,
    validateRate,
    displayValues,
  };
}

// 쿠폰 할인값 검증 훅
export function useValidateCouponDiscountValue() {
  const validateDiscountValue = useCallback(
    (
      value: number,
      discountType: 'amount' | 'percentage'
    ): ValidationResult => {
      return validateCouponDiscountValue({ value, discountType });
    },
    []
  );

  const validateDiscountInput = useCallback((value: string): boolean => {
    return isValidNumberFormat({ value });
  }, []);

  const normalizeDiscountValue = useCallback((value: string): number => {
    return normalizeCouponDiscountValue({ value });
  }, []);

  const normalizeDiscountValueWithLimits = useCallback(
    (
      value: number,
      discountType: 'amount' | 'percentage'
    ): { normalizedValue: number; errorMessage?: string } => {
      return normalizeCouponDiscountValueWithLimits({ value, discountType });
    },
    []
  );

  return {
    validateDiscountValue,
    validateDiscountInput,
    normalizeDiscountValue,
    normalizeDiscountValueWithLimits,
  };
}

// 쿠폰 코드 검증 훅
export function useValidateCouponCode() {
  const validateCode = useCallback((code: string): ValidationResult => {
    return validateCouponCode({ code });
  }, []);

  const normalizeCode = useCallback((code: string): string => {
    return normalizeCouponCode({ code });
  }, []);

  return {
    validateCode,
    normalizeCode,
  };
}

// 쿠폰명 검증 훅
export function useValidateCouponName() {
  const validateName = useCallback((name: string): ValidationResult => {
    return validateCouponName({ name });
  }, []);

  return validateName;
}

// 통합 쿠폰 검증 훅
export function useCouponFormValidation() {
  const validateDiscountValue = useValidateCouponDiscountValue();
  const validateCode = useValidateCouponCode();
  const validateName = useValidateCouponName();
  const displayValues = useDisplayValues();

  return {
    validateDiscountValue,
    validateCode,
    validateName,
    displayValues,
  };
}
