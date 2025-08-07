/**
 * 가격을 한국 원화 형식으로 포맷
 * @param price 가격
 * @param locale 로케일 (기본값: "ko-KR")
 * @param options Intl.NumberFormatOptions (기본값: { style: "currency", currency: "KRW" })
 * @returns 포맷된 가격
 */
export function formatPrice(
  price: number,
  locale: string = "ko-KR",
  options: Intl.NumberFormatOptions = { style: "currency", currency: "KRW" }
): string {
  return new Intl.NumberFormat(locale, options).format(price);
}

export namespace formatPrice {
  /**
   * 예: 5,000원
   */
  export function unit(price: number): string {
    const raw = formatPrice(price, "ko-KR", {
      style: "currency",
      currency: "KRW",
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    });

    return raw.replace("KRW", "").trim() + "원";
  }

  /**
   * 예: ₩5,000
   */
  export function currency(price: number): string {
    return formatPrice(price, "ko-KR", {
      style: "currency",
      currency: "KRW",
      currencyDisplay: "symbol", // "₩"으로 표시
      maximumFractionDigits: 0,
    });
  }
}
