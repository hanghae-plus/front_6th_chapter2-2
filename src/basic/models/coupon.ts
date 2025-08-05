export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

export const initialCouponForm: CouponForm = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};
