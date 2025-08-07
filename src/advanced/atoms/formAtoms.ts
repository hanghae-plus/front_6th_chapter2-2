import { atom } from 'jotai';

import { CouponForm, ProductForm, ProductWithUI } from '../types';

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

// Product Form action atoms

// 상품 폼 초기화 및 닫기
export const handleProductFormSubmitAtom = atom(null, (get, set) => {
  set(productFormAtom, {
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });
  set(showProductFormAtom, false);
});

// 상품 편집 시작
export const startEditProductAtom = atom(null, (get, set, product: ProductWithUI | string) => {
  if (typeof product === 'string') {
    set(editingProductAtom, product);
  } else {
    set(editingProductAtom, product.id);
    set(productFormAtom, {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
  }
  set(showProductFormAtom, true);
});

// 상품 편집 취소
export const handleCancelProductAtom = atom(null, (get, set) => {
  set(editingProductAtom, null);
  set(productFormAtom, {
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });
  set(showProductFormAtom, false);
});

// 편집 중인 상품 리셋
export const resetEditingProductAtom = atom(null, (get, set) => {
  set(editingProductAtom, null);
});

// 상품 폼 업데이트
export const updateProductFormAtom = atom(null, (get, set, form: Partial<ProductForm>) => {
  const currentForm = get(productFormAtom);
  set(productFormAtom, { ...currentForm, ...form });
});

// 상품 폼 표시 상태 업데이트
export const updateShowProductFormAtom = atom(null, (get, set, show: boolean) => {
  set(showProductFormAtom, show);
});

// Coupon Form atoms
export const couponFormAtom = atom<CouponForm>({
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
});

export const showCouponFormAtom = atom<boolean>(false);

// Coupon Form action atoms

// 쿠폰 폼 초기화 및 닫기
export const handleCouponFormSubmitAtom = atom(null, (get, set) => {
  set(couponFormAtom, {
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });
  set(showCouponFormAtom, false);
});

// 쿠폰 폼 업데이트
export const updateCouponFormAtom = atom(null, (get, set, form: Partial<CouponForm>) => {
  const currentForm = get(couponFormAtom);
  set(couponFormAtom, { ...currentForm, ...form });
});

// 쿠폰 폼 표시 상태 업데이트
export const updateShowCouponFormAtom = atom(null, (get, set, show: boolean) => {
  set(showCouponFormAtom, show);
});
