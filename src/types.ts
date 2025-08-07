/**
 * @interface Product
 * @property {string} id - 상품 ID
 * @property {string} name - 상품 이름
 * @property {number} price - 상품 가격
 * @property {number} stock - 상품 재고
 * @property {Discount[]} discounts - 상품 할인 정보
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

/**
 * @interface Discount
 * @property {number} quantity - 할인 적용 수량
 * @property {number} rate - 할인 비율
 */
export interface Discount {
  quantity: number;
  rate: number;
}

/**
 * @interface CartItem
 * @property {Product} product - 상품
 * @property {number} quantity - 수량
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * @interface Coupon
 * @property {string} name - 쿠폰 이름
 * @property {string} code - 쿠폰 코드
 * @property {'amount' | 'percentage'} discountType - 할인 타입
 * @property {number} discountValue - 할인 값
 */
export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

/**
 * @interface CouponFormData
 * @property {string} name - 쿠폰 이름
 * @property {string} code - 쿠폰 코드
 * @property {'amount' | 'percentage'} discountType - 할인 타입
 * @property {number} discountValue - 할인 값
 */
export interface CouponFormData {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

/**
 * @interface ProductFormData
 * @property {string} name - 상품 이름
 * @property {number} price - 상품 가격
 * @property {number} stock - 상품 재고
 * @property {string} description - 상품 설명
 * @property {Array<{ quantity: number; rate: number }>} discounts - 상품 할인 정보
 */
export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}
