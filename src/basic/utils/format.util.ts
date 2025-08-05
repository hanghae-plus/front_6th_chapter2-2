/**
 * 가격을 한국 원화 형식으로 포맷
 * @param price 가격
 * @returns 포맷된 가격
 */
export function formatPrice(
  price: number,
  locale: string = "ko-KR",
  options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "KRW",
  }
): string {
  return price.toLocaleString(locale, options);
}
