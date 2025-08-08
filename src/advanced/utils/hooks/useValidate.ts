import { useState, useCallback } from "react";

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export interface UseValidateOptions<T> {
  rules: ValidationRule<T>[];
  initialValue?: T;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  hasErrors: boolean;
}

export function useValidate<T>(options: UseValidateOptions<T>) {
  const { rules } = options;
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback(
    (value: T): ValidationResult => {
      const newErrors: string[] = [];

      rules.forEach((rule) => {
        if (!rule.validate(value)) {
          newErrors.push(rule.message);
        }
      });

      setErrors(newErrors);

      return {
        isValid: newErrors.length === 0,
        errors: newErrors,
        hasErrors: newErrors.length > 0,
      };
    },
    [rules]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    isValid: errors.length === 0,
    hasErrors: errors.length > 0,
  };
}

// 자주 사용하는 검증 규칙들
export const validationRules = {
  required: <T>(value: T): boolean => {
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number") return value > 0;
    return value !== null && value !== undefined;
  },

  minLength:
    (min: number) =>
    (value: string): boolean => {
      return value.length >= min;
    },

  maxLength:
    (max: number) =>
    (value: string): boolean => {
      return value.length <= max;
    },

  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  positiveNumber: (value: number): boolean => {
    return value > 0;
  },

  price: (value: number): boolean => {
    return value >= 0 && value <= 10000000; // 최대 1천만원
  },

  couponCode: (value: string): boolean => {
    return /^[A-Z0-9]+$/.test(value) && value.length >= 3;
  },
};
