export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

// 숫자만 추출하는 유틸리티 함수
export function extractNumbers(value: string): string {
  return value.replace(/[^\d]/g, '');
}

// 숫자 형식 검증 (빈 문자열 또는 숫자만)
export function isValidNumberFormat({ value }: { value: string }): boolean {
  return value === '' || /^\d+$/.test(value);
}

// 가격 검증
export function validatePrice({ price }: { price: number }): ValidationResult {
  const errors: string[] = [];

  if (price < 0) {
    errors.push('가격은 0보다 커야 합니다');
  }

  if (price === 0) {
    errors.push('가격은 0보다 커야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 가격 개별 검증 (원본과 동일한 방식)
export function validatePriceIndividual({ price }: { price: number }): {
  isValid: boolean;
  errorMessage?: string;
} {
  if (price < 0) {
    return { isValid: false, errorMessage: '가격은 0보다 커야 합니다' };
  }
  return { isValid: true };
}

// 재고 검증
export function validateStock({ stock }: { stock: number }): ValidationResult {
  const errors: string[] = [];

  if (stock < 0) {
    errors.push('재고는 0보다 커야 합니다');
  }

  if (stock > 9999) {
    errors.push('재고는 9999개를 초과할 수 없습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 재고 개별 검증 (원본과 동일한 방식)
export function validateStockIndividual({ stock }: { stock: number }): {
  isValid: boolean;
  errorMessage?: string;
  correctedValue?: number;
} {
  if (stock < 0) {
    return {
      isValid: false,
      errorMessage: '재고는 0보다 커야 합니다',
      correctedValue: 0,
    };
  }
  if (stock > 9999) {
    return {
      isValid: false,
      errorMessage: '재고는 9999개를 초과할 수 없습니다',
      correctedValue: 9999,
    };
  }
  return { isValid: true };
}

// 할인율 검증
export function validateDiscountRate({
  rate,
}: {
  rate: number;
}): ValidationResult {
  const errors: string[] = [];

  if (rate < 0) {
    errors.push('할인율은 0% 이상이어야 합니다');
  }

  if (rate > 100) {
    errors.push('할인율은 100%를 초과할 수 없습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 입력값 정규화 함수들
export function normalizePriceInput({ value }: { value: string }): number {
  if (value === '') return 0;
  return parseInt(value) || 0;
}

export function normalizeStockInput({ value }: { value: string }): number {
  if (value === '') return 0;
  return parseInt(value) || 0;
}

export function normalizeDiscountRateInput({
  value,
}: {
  value: string;
}): number {
  if (value === '') return 0;
  return (parseInt(value) || 0) / 100;
}

// 표시용 값 변환 함수들
export function getDisplayValue({ value }: { value: number }): string {
  return value === 0 ? '' : value.toString();
}

export function getDiscountRateDisplay({ rate }: { rate: number }): number {
  return rate * 100;
}

// 쿠폰 할인값 검증
export function validateCouponDiscountValue({
  value,
  discountType,
}: {
  value: number;
  discountType: 'amount' | 'percentage';
}): ValidationResult {
  const errors: string[] = [];

  if (value < 0) {
    errors.push('할인값은 0 이상이어야 합니다');
  }

  if (discountType === 'percentage') {
    if (value > 100) {
      errors.push('할인율은 100%를 초과할 수 없습니다');
    }
  } else {
    if (value > 100000) {
      errors.push('할인 금액은 100,000원을 초과할 수 없습니다');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 쿠폰 할인값 정규화 (원래 기능 유지)
export function normalizeCouponDiscountValueWithLimits({
  value,
  discountType,
}: {
  value: number;
  discountType: 'amount' | 'percentage';
}): { normalizedValue: number; errorMessage?: string } {
  if (discountType === 'percentage') {
    if (value > 100) {
      return {
        normalizedValue: 100,
        errorMessage: '할인율은 100%를 초과할 수 없습니다',
      };
    } else if (value < 0) {
      return { normalizedValue: 0 };
    }
  } else {
    if (value > 100000) {
      return {
        normalizedValue: 100000,
        errorMessage: '할인 금액은 100,000원을 초과할 수 없습니다',
      };
    } else if (value < 0) {
      return { normalizedValue: 0 };
    }
  }

  return { normalizedValue: value };
}

// 쿠폰 코드 검증
export function validateCouponCode({
  code,
}: {
  code: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!code || code.trim().length === 0) {
    errors.push('쿠폰 코드는 필수입니다');
  }

  if (code.length < 4) {
    errors.push('쿠폰 코드는 4자 이상이어야 합니다');
  }

  if (code.length > 12) {
    errors.push('쿠폰 코드는 12자 이하여야 합니다');
  }

  if (!/^[A-Z0-9]+$/.test(code)) {
    errors.push('쿠폰 코드는 영문 대문자와 숫자만 사용할 수 있습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 쿠폰명 검증
export function validateCouponName({
  name,
}: {
  name: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('쿠폰명은 필수입니다');
  }

  if (name.length > 50) {
    errors.push('쿠폰명은 50자 이하여야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 쿠폰 할인값 정규화
export function normalizeCouponDiscountValue({
  value,
}: {
  value: string;
}): number {
  if (value === '') return 0;
  return parseInt(value) || 0;
}

// 쿠폰 코드 정규화 (대문자 변환)
export function normalizeCouponCode({ code }: { code: string }): string {
  return code.toUpperCase();
}
