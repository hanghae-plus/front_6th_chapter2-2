import { Coupon } from '@/types';

export class CouponModel {
  constructor(private coupons: Coupon[] = []) {}

  get couponList(): Coupon[] {
    return [...this.coupons];
  }

  get count(): number {
    return this.coupons.length;
  }

  validateCouponCode(code: string) {
    if (!code.trim()) {
      return {
        isValid: false,
        errorMessage: '쿠폰 코드를 입력해주세요.',
      };
    }

    const isDuplicate = this.coupons.some((coupon) => coupon.code === code);
    if (isDuplicate) {
      return {
        isValid: false,
        errorMessage: '이미 존재하는 쿠폰 코드입니다.',
      };
    }

    return { isValid: true };
  }

  validateCouponApplication(coupon: Coupon, currentTotal: number) {
    const minimumAmount = 10000;
    if (currentTotal < minimumAmount) {
      return {
        isValid: false,
        errorMessage: `${minimumAmount.toLocaleString()}원 이상 구매 시 쿠폰을 사용할 수 있습니다.`,
      };
    }

    if (coupon.discountType === 'amount' && coupon.discountValue >= currentTotal) {
      return {
        isValid: false,
        errorMessage: '쿠폰 할인 금액이 주문 금액보다 클 수 없습니다.',
      };
    }

    return { isValid: true };
  }

  add(newCoupon: Coupon): CouponModel {
    return new CouponModel([...this.coupons, newCoupon]);
  }

  remove(couponCode: string): CouponModel {
    const newCoupons = this.coupons.filter((coupon) => coupon.code !== couponCode);
    return new CouponModel(newCoupons);
  }

  findByCode(code: string): Coupon | undefined {
    return this.coupons.find((coupon) => coupon.code === code);
  }

  findByDiscountType(type: 'amount' | 'percentage'): Coupon[] {
    return this.coupons.filter((coupon) => coupon.discountType === type);
  }

  getApplicableCoupons(currentTotal: number): Coupon[] {
    return this.coupons.filter(
      (coupon) => this.validateCouponApplication(coupon, currentTotal).isValid
    );
  }
}
