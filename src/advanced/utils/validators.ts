/** 문자열에서 숫자만 추출 */
export const extractNumbers = (value: string): string => (value.match(/\d+/g) || []).join('');

/** 공통 입력 처리: 빈 문자열이면 0, 숫자만 허용 */
export const parseIntOrZero = (value: string): number => {
  const only = extractNumbers(value);
  return only === '' ? 0 : parseInt(only, 10);
};

/** 문자열이 숫자만으로 구성되었는지 확인 */
export const isDigitsOnly = (value: string): boolean => /^\d+$/.test(value);
