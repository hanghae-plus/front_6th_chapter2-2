/**
 * 안전한 파싱 유틸리티 함수들
 */
export const parsers = {
  /**
   * 안전한 정수 파싱
   */
  safeParseInt: (value: string, defaultValue: number = 0): number => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  },

  /**
   * 안전한 실수 파싱
   */
  safeParseFloat: (value: string, defaultValue: number = 0): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  },

  /**
   * 퍼센트 문자열을 소수로 변환 (예: "10" → 0.1)
   */
  parsePercentage: (value: string): number => {
    return parsers.safeParseFloat(value) / 100;
  },

  /**
   * 문자열을 숫자로 변환 (빈 문자열 처리)
   */
  parseNumericInput: (value: string, defaultValue: number = 0): number => {
    if (value === "") return defaultValue;
    return parsers.safeParseInt(value, defaultValue);
  },

  /**
   * 할인율 문자열을 소수로 변환 (예: "10" → 0.1)
   */
  parseDiscountRate: (value: string): number => {
    return parsers.parsePercentage(value);
  },
};
