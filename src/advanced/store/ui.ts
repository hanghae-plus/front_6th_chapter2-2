import { atom } from 'jotai';

// UI state atoms
export const isAdminAtom = atom(false);
export const debouncedSearchTermAtom = atom('');

// Admin UI atoms (non-persisted) to avoid prop drilling
export type ProductFormData = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

export const showProductFormAtom = atom(false);
export const editingProductIdAtom = atom<string | null>(null);
export const productFormAtom = atom<ProductFormData>({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
});

// Coupon admin UI
export type CouponFormData = {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
};

export const showCouponFormAtom = atom(false);
export const couponFormAtom = atom<CouponFormData>({
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
});
