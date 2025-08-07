import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Coupon, Product, CartItem } from '../types';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: '최고급 품질의 프리미엄 상품입니다.',
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.',
  },
];

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

// localStorage와 동기화되는 atoms
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 기본 atoms
export const selectedCouponAtom = atom<Coupon | null>(null);
export const isAdminAtom = atom<boolean>(false);
export const searchTermAtom = atom<string>('');

// Admin 관련 atoms
export const showCouponFormAtom = atom<boolean>(false);
export const activeTabAtom = atom<'products' | 'coupons'>('products');
export const showProductFormAtom = atom<boolean>(false);
export const editingProductAtom = atom<string | null>(null);

// Form atoms
export const productFormAtom = atom({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [] as Array<{ quantity: number; rate: number }>,
});

export const couponFormAtom = atom({
  name: '',
  code: '',
  discountType: 'amount' as 'amount' | 'percentage',
  discountValue: 0,
});

// Notification atoms - 타입 수정
export const notificationsAtom = atom<
  Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning';
    timestamp: number;
  }>
>([]);

// Computed atoms
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});

export const cartLengthAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.length;
});

export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);

  if (!searchTerm.trim()) return products;

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
});
