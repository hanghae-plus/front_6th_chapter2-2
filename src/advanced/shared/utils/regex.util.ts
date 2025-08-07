export const NUMERIC_PATTERNS = {
  DIGITS_ONLY: /^\d+$/,
} as const;

export const regexUtils = {
  isNumeric: (value: string) => NUMERIC_PATTERNS.DIGITS_ONLY.test(value),
} as const;
