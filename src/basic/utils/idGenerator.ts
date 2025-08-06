/**
 * 고유 ID 생성 유틸리티
 */

// 각 엔티티별 카운터
const counters: Record<string, number> = {
  product: 0,
  coupon: 0,
  cart: 0,
  notification: 0,
};

type EntityType = "product" | "coupon" | "cart" | "notification";

/**
 * 엔티티별 고유 ID 생성
 * @param entityType 엔티티 타입
 * @returns 고유 ID 문자열
 */
export const generateId = (entityType: EntityType): string => {
  const timestamp = Date.now();
  const counter = ++counters[entityType];
  const prefix = entityType.charAt(0);

  return `${prefix}${timestamp}-${counter}`;
};

/**
 * 테스트용 카운터 리셋
 */
export const resetCounters = (): void => {
  Object.keys(counters).forEach((key) => {
    counters[key] = 0;
  });
};
