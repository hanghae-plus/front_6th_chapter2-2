/**
 * 숫자를 반올림하여 정수로 변환합니다.
 *
 * @param num - 반올림할 숫자
 * @returns 반올림된 정수
 *
 * @example
 * roundNumber(3.7) // returns 4
 * roundNumber(3.2) // returns 3
 * roundNumber(-3.7) // returns -4
 */
export const roundNumber = (num: number): number => {
  return Math.round(num);
};
