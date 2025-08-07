export interface CouponFormType {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
