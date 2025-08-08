import { atom } from 'jotai';

import { cartAtom, couponsAtom, productsAtom, selectedCouponAtom } from './entities';
import type { Coupon, ProductWithUI } from '../../types';
import { getRemainingStock as calcRemainingStock } from '../utils/stock.ts';

// Cart actions
export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  const cart = get(cartAtom);
  const remaining = calcRemainingStock(product, cart);
  if (remaining <= 0) {
    throw new Error(`상품 "${product.name}"의 재고가 부족합니다.`);
  }

  const existing = cart.find((i) => i.product.id === product.id);
  if (existing) {
    const newQty = existing.quantity + 1;
    if (newQty > product.stock) {
      throw new Error(`상품 "${product.name}"의 재고는 ${product.stock}개까지만 가능합니다.`);
    }
    set(
      cartAtom,
      cart.map((i) => (i.product.id === product.id ? { ...i, quantity: newQty } : i)),
    );
  } else {
    set(cartAtom, [...cart, { product, quantity: 1 }]);
  }
});

export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const cart = get(cartAtom);
  set(
    cartAtom,
    cart.filter((i) => i.product.id !== productId),
  );
});

export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, quantity }: { productId: string; quantity: number }) => {
    const cart = get(cartAtom);
    set(
      cartAtom,
      cart.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    );
  },
);

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartAtom, []);
  set(selectedCouponAtom, null);
});

// Product actions
export const updateProductAtom = atom(
  null,
  (get, set, { productId, updates }: { productId: string; updates: Partial<ProductWithUI> }) => {
    const products = get(productsAtom);
    set(
      productsAtom,
      products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    );
  },
);

export const addProductAtom = atom(null, (get, set, newProduct: Omit<ProductWithUI, 'id'>) => {
  const products = get(productsAtom);
  const product = { ...newProduct, id: `p${Date.now()}` } as ProductWithUI;
  set(productsAtom, [...products, product]);
});

export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  const products = get(productsAtom);
  set(
    productsAtom,
    products.filter((p) => p.id !== productId),
  );
});

// Coupon actions
export const addCouponAtom = atom(null, (get, set, coupon: Coupon) => {
  const coupons = get(couponsAtom);
  if (coupons.some((c) => c.code === coupon.code)) return; // noop if exists
  set(couponsAtom, [...coupons, coupon]);
});

export const removeCouponAtom = atom(null, (get, set, couponCode: string) => {
  const coupons = get(couponsAtom);
  set(
    couponsAtom,
    coupons.filter((c) => c.code !== couponCode),
  );
});
