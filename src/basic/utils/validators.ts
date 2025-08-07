// 검증 유틸리티 함수들 (순수 함수)
// 모든 함수는 부작용 없이 입력값의 유효성만 검증

import {
  MIN_PRODUCT_PRICE,
  MAX_PRODUCT_PRICE,
  MIN_STOCK,
  MAX_STOCK,
} from "../constants/product";

/**
 * 쿠폰 코드의 유효성을 검증합니다
 * @param code 검증할 쿠폰 코드
 * @returns 유효한 코드면 true, 그렇지 않으면 false
 */
export function isValidCouponCode(code: string): boolean {
  // 4-12자 영문 대문자와 숫자만 허용
  const codeRegex = /^[A-Z0-9]{4,12}$/;
  return codeRegex.test(code);
}

/**
 * 재고 수량의 유효성을 검증합니다
 * @param stock 검증할 재고 수량
 * @returns 유효한 재고면 true, 그렇지 않으면 false
 */
export function isValidStock(stock: number): boolean {
  return Number.isInteger(stock) && stock >= MIN_STOCK && stock <= MAX_STOCK;
}

/**
 * 가격의 유효성을 검증합니다
 * @param price 검증할 가격
 * @returns 유효한 가격이면 true, 그렇지 않으면 false
 */
export function isValidPrice(price: number): boolean {
  return price > MIN_PRODUCT_PRICE && price <= MAX_PRODUCT_PRICE;
}

/**
 * 문자열에서 숫자만 추출합니다
 * @param value 처리할 문자열
 * @returns 숫자만 포함된 문자열
 */
export function extractNumbers(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/**
 * 상품명의 유효성을 검증합니다
 * @param name 검증할 상품명
 * @returns 유효한 이름이면 true, 그렇지 않으면 false
 */
export function isValidProductName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 100;
}

/**
 * 할인율의 유효성을 검증합니다
 * @param rate 검증할 할인율 (0~1 사이 값)
 * @returns 유효한 할인율이면 true, 그렇지 않으면 false
 */
export function isValidDiscountRate(rate: number): boolean {
  return rate > 0 && rate <= 1;
}

/**
 * 수량의 유효성을 검증합니다
 * @param quantity 검증할 수량
 * @returns 유효한 수량이면 true, 그렇지 않으면 false
 */
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 1000;
}

/**
 * 이메일 형식의 유효성을 검증합니다
 * @param email 검증할 이메일
 * @returns 유효한 이메일 형식이면 true, 그렇지 않으면 false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 전화번호 형식의 유효성을 검증합니다 (한국 형식)
 * @param phone 검증할 전화번호
 * @returns 유효한 전화번호 형식이면 true, 그렇지 않으면 false
 */
export function isValidPhoneNumber(phone: string): boolean {
  // 010-1234-5678 또는 01012345678 형식
  const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  return phoneRegex.test(phone);
}
