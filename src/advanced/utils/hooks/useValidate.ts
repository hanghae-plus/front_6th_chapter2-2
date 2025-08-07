// 검증 관련 훅
// 폼 입력값 검증과 에러 상태 관리를 위한 커스텀 훅

import { useState, useCallback } from "react";
import {
  isValidCouponCode,
  isValidStock,
  isValidPrice,
  isValidProductName,
  isValidDiscountRate,
  isValidQuantity,
  isValidEmail,
  isValidPhoneNumber,
  extractNumbers,
} from "../validators";

export interface ValidationErrors {
  [key: string]: string;
}

export interface UseValidateReturn {
  errors: ValidationErrors;
  validateField: (
    fieldName: string,
    value: any,
    validationType: string
  ) => boolean;
  validateAllFields: (
    fields: Record<string, { value: any; type: string }>
  ) => boolean;
  clearError: (fieldName: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
  getError: (fieldName: string) => string | undefined;
}

/**
 * 검증 관련 상태와 함수를 제공하는 훅
 *
 * 주요 기능:
 * 1. 필드별 검증 에러 상태 관리
 * 2. 개별 필드 검증
 * 3. 전체 필드 일괄 검증
 * 4. 에러 메시지 관리
 *
 * @returns 검증 관련 상태와 함수들
 */
export function useValidate(): UseValidateReturn {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 개별 필드 검증
  const validateField = useCallback(
    (fieldName: string, value: any, validationType: string): boolean => {
      let isValid = true;
      let errorMessage = "";

      switch (validationType) {
        case "couponCode":
          isValid = isValidCouponCode(value);
          if (!isValid)
            errorMessage =
              "쿠폰 코드는 4-12자의 영문 대문자와 숫자만 허용됩니다.";
          break;

        case "stock":
          isValid = isValidStock(value);
          if (!isValid)
            errorMessage = "재고는 0 이상 100,000 이하의 정수여야 합니다.";
          break;

        case "price":
          isValid = isValidPrice(value);
          if (!isValid)
            errorMessage = "가격은 0보다 크고 10,000,000원 이하여야 합니다.";
          break;

        case "productName":
          isValid = isValidProductName(value);
          if (!isValid)
            errorMessage = "상품명은 1자 이상 100자 이하여야 합니다.";
          break;

        case "discountRate":
          isValid = isValidDiscountRate(value);
          if (!isValid)
            errorMessage = "할인율은 0%보다 크고 100% 이하여야 합니다.";
          break;

        case "quantity":
          isValid = isValidQuantity(value);
          if (!isValid)
            errorMessage = "수량은 1 이상 1,000 이하의 정수여야 합니다.";
          break;

        case "email":
          isValid = isValidEmail(value);
          if (!isValid) errorMessage = "올바른 이메일 형식이 아닙니다.";
          break;

        case "phoneNumber":
          isValid = isValidPhoneNumber(value);
          if (!isValid)
            errorMessage =
              "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)";
          break;

        case "required":
          isValid = value !== null && value !== undefined && value !== "";
          if (!isValid) errorMessage = "필수 입력 항목입니다.";
          break;

        default:
          console.warn(`Unknown validation type: ${validationType}`);
          break;
      }

      setErrors((prev) => {
        if (isValid) {
          // 에러가 없으면 해당 필드의 에러 제거
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        } else {
          // 에러가 있으면 에러 메시지 설정
          return { ...prev, [fieldName]: errorMessage };
        }
      });

      return isValid;
    },
    []
  );

  // 전체 필드 일괄 검증
  const validateAllFields = useCallback(
    (fields: Record<string, { value: any; type: string }>): boolean => {
      let allValid = true;

      Object.entries(fields).forEach(([fieldName, { value, type }]) => {
        const isValid = validateField(fieldName, value, type);
        if (!isValid) {
          allValid = false;
        }
      });

      return allValid;
    },
    [validateField]
  );

  // 특정 필드의 에러 제거
  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // 모든 에러 제거
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // 특정 필드의 에러 메시지 가져오기
  const getError = useCallback(
    (fieldName: string): string | undefined => {
      return errors[fieldName];
    },
    [errors]
  );

  // 에러가 있는지 확인
  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validateField,
    validateAllFields,
    clearError,
    clearAllErrors,
    hasErrors,
    getError,
  };
}

/**
 * 숫자 입력 필드를 위한 검증 훅
 * 입력값을 숫자로 변환하고 검증합니다
 *
 * @param initialValue 초기값
 * @param validationType 검증 타입
 * @returns 숫자 입력 상태와 검증 함수들
 */
export function useNumericValidate(
  initialValue: number = 0,
  validationType: string
) {
  const [value, setValue] = useState<string>(initialValue.toString());
  const { validateField, getError, clearError } = useValidate();

  const handleChange = useCallback(
    (inputValue: string) => {
      // 숫자만 추출
      const numericValue = extractNumbers(inputValue);
      setValue(numericValue);

      // 검증 실행
      const numValue = numericValue === "" ? 0 : parseInt(numericValue, 10);
      validateField("numericField", numValue, validationType);
    },
    [validateField, validationType]
  );

  const getNumericValue = useCallback((): number => {
    return value === "" ? 0 : parseInt(value, 10);
  }, [value]);

  return {
    value,
    setValue,
    handleChange,
    getNumericValue,
    error: getError("numericField"),
    clearError: () => clearError("numericField"),
  };
}
