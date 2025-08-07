/**
 * 숫자 입력 검증 유틸리티 함수들
 */
export const isValidNumericInput = (input: string): boolean => {
  return input === "" || /^\d+$/.test(input);
};
