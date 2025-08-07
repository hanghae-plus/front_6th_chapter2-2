import type { CouponFormData as CouponFormDataType } from '../../types';

export const DEFAULT_COUPON_FORM: CouponFormDataType = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};
