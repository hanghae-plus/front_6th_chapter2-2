export const stringUtils = {
  /**
   * 쿠폰 코드 정규화
   */
  normalizeCouponCode(input: string): string {
    return input.trim().toUpperCase().replace(/\s+/g, "-");
  },

  /**
   * 문자열 정규화 (공백 제거, 대문자 변환)
   */
  normalize(input: string): string {
    return input.trim().toUpperCase().replace(/\s+/g, "-");
  },

  /**
   * 첫 글자 대문자 변환
   */
  capitalize(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  },
};
