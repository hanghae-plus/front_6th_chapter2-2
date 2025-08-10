export const numberUtils = {
  /**
   * 값 범위 제한
   */
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  },

  /**
   * 최대값 찾기 (빈 배열 처리 포함)
   */
  findMax(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.max(...values);
  },

  /**
   * 최소값 찾기 (빈 배열 처리 포함)
   */
  findMin(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.min(...values);
  },

  /**
   * 양수 확인
   */
  isPositive(value: number): boolean {
    return value > 0;
  },

  /**
   * 0 이상 확인
   */
  isNonNegative(value: number): boolean {
    return value >= 0;
  },
};
