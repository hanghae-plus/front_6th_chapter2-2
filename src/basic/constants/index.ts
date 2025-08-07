import { Coupon, ProductWithUI } from "../../types";

// 초기 데이터
export const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

export const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

export const NOTIFICATION_MESSAGE = {
  PRODUCT: {
    ADD: "상품이 추가되었습니다.",
    UPDATE: "상품이 수정되었습니다.",
    DELETE: "상품이 삭제되었습니다.",
  },
  CART: {
    ADD: "장바구니에 담았습니다",
  },
  ORDER: {
    ADD: (orderNumber: string) =>
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
  },
  COUPON: {
    ADD: "쿠폰이 추가되었습니다.",
    APPLIED: "쿠폰이 적용되었습니다.",
    DELETE: "쿠폰이 삭제되었습니다.",
  },
  ERROR: {
    MIN_PRICE: "가격은 0보다 커야 합니다",
    MIN_COUPON: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
    EXISTED_COUPON: "이미 존재하는 쿠폰 코드입니다.",
    NONE_STOCK: "재고가 부족합니다!",
    MIN_STOCK: "재고는 0보다 커야 합니다",
    MAX_STOCK: "재고는 9999개를 초과할 수 없습니다",
    INSUFFICIENT_STOCK: (stock: number) => `재고는 ${stock}개까지만 있습니다.`,
    MAX_SALE_PERCENT: "할인율은 100%를 초과할 수 없습니다",
    MAX_SALE_PRICE: "할인 금액은 100,000원을 초과할 수 없습니다",
  },
} as const;
