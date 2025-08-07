import { atom } from 'jotai';

import { CouponForm, ProductForm } from '../types';

// Product Form atoms
export const productFormAtom = atom<ProductForm>({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
});

export const showProductFormAtom = atom<boolean>(false);
export const editingProductAtom = atom<string | null>(null);

// Coupon Form atoms
export const couponFormAtom = atom<CouponForm>({
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
});

export const showCouponFormAtom = atom<boolean>(false);
