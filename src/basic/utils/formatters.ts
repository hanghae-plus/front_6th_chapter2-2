/**
 * 가격을 한국 원화 형식으로 포맷 (재고 상태 및 관리자 모드 고려)
 * @param price - 포맷할 가격 (숫자)
 * @param options - 포맷 옵션
 * @returns 포맷된 가격 문자열
 */
export const formatPrice = (
  price: number,
  options: {
    productId?: string;
    products?: any[];
    getRemainingStock?: (product: any) => number;
    isAdmin?: boolean;
  } = {}
): string => {
  const { productId, products, getRemainingStock, isAdmin = false } = options;

  // SOLD OUT 체크
  if (productId && products && getRemainingStock) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product) <= 0) {
      return "SOLD OUT";
    }
  }

  // 관리자/일반 사용자 포맷 구분
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 * @param date - 포맷할 날짜 객체
 * @returns 포맷된 날짜 문자열 (예: "2024-12-20")
 */
export function formatDate(date: Date): string {
  // 유효성 검사
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "잘못된 날짜";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * 소수를 퍼센트로 변환
 * @param rate - 변환할 비율 (0.1 = 10%)
 * @returns 포맷된 퍼센트 문자열 (예: "10%")
 */
export function formatPercentage(rate: number): string {
  // 유효성 검사
  if (typeof rate !== "number" || isNaN(rate)) {
    return "0%";
  }

  // 소수점 2자리까지 표시 (필요시에만)
  const percentage = Math.round(rate * 100 * 100) / 100; // 반올림 처리

  // 정수면 소수점 제거, 아니면 최대 2자리까지
  if (percentage === Math.floor(percentage)) {
    return `${percentage}%`;
  } else {
    return `${percentage.toFixed(2).replace(/\.?0+$/, "")}%`;
  }
}

// 추가 유틸리티 함수들 (보너스)

/**
 * 할인율을 표시용으로 포맷 (-10% 형태)
 * @param rate - 할인율 (0.1 = 10%)
 * @returns 포맷된 할인율 문자열 (예: "-10%")
 */
export function formatDiscountRate(rate: number): string {
  if (typeof rate !== "number" || isNaN(rate) || rate <= 0) {
    return "";
  }

  const percentage = Math.round(rate * 100);
  return `-${percentage}%`;
}

/**
 * 숫자를 간단한 형태로 포맷 (1000 → 1K)
 * @param num - 포맷할 숫자
 * @returns 포맷된 숫자 문자열
 */
export function formatNumber(num: number): string {
  if (typeof num !== "number" || isNaN(num)) {
    return "0";
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return num.toString();
}

/**
 * 상대적 시간을 표시 (1분 전, 1시간 전 등)
 * @param date - 기준이 될 날짜
 * @returns 상대적 시간 문자열
 */
export function formatRelativeTime(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "알 수 없음";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }

  return formatDate(date);
}
