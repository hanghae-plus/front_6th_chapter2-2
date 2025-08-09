export const INITIAL_PRODUCT_FORM = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [] as Array<{ quantity: number; rate: number }>,
};

export const INITIAL_COUPON_FORM = {
  name: '',
  code: '',
  discountType: 'amount' as const,
  discountValue: 0,
};

export const EDITING_STATES = {
  NEW: 'new',
} as const;
