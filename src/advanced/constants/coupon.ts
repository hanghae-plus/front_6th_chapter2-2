/**
 * 쿠폰 관련 제약사항
 */
export const COUPON_CONSTRAINTS = {
  // 할인율 관련
  MIN_PERCENTAGE: 0, // 0%
  MAX_PERCENTAGE: 100, // 100%

  // 할인 금액 관련
  MIN_AMOUNT: 0, // 0원
  MAX_AMOUNT: 100000, // 100,000원

  // 쿠폰명/코드 관련
  MAX_NAME_LENGTH: 30,
  MAX_CODE_LENGTH: 12,
} as const;

/**
 * 에러 메시지 상수
 */
export const COUPON_ERROR_MESSAGES = {
  // 할인율 관련
  PERCENTAGE_OVER_MAX: "할인율은 100%를 초과할 수 없습니다",
  PERCENTAGE_UNDER_MIN: "할인율은 0% 이상이어야 합니다",

  // 할인 금액 관련
  AMOUNT_OVER_MAX: "할인 금액은 100,000원을 초과할 수 없습니다",
  AMOUNT_UNDER_MIN: "할인 금액은 0원 이상이어야 합니다",

  // 입력 관련
  ONLY_NUMBERS: "숫자만 입력 가능합니다",

  // 폼 검증 관련
  NAME_REQUIRED: "쿠폰명을 입력해주세요",
  CODE_REQUIRED: "쿠폰 코드를 입력해주세요",
  DISCOUNT_VALUE_REQUIRED: "할인값은 0보다 커야 합니다",
} as const;
