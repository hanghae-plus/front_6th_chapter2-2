import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Product, ProductWithUI } from '../../types';

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

export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);

export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    set(productsAtom, (prev) => [...prev, product]);
  }
);

export const updateProductAtom = atom(
  null,
  (get, set, productId: string, updates: Partial<Product>) => {
    set(productsAtom, (prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  }
);

export const deleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    set(productsAtom, (prev) => prev.filter((p) => p.id !== productId));
  }
);
