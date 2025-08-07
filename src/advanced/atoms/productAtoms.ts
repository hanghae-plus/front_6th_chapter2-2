import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { ProductWithUI, ProductForm } from '../types';

// 초기 제품 데이터
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

// localStorage와 동기화되는 products atom
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);

// 상품 추가 액션
export const addProductAtom = atom(null, (get, set, productForm: ProductForm) => {
  const currentProducts = get(productsAtom);
  const newProduct: ProductWithUI = {
    id: `p${Date.now()}`,
    ...productForm,
  };
  set(productsAtom, [...currentProducts, newProduct]);
});

// 상품 업데이트 액션
export const updateProductAtom = atom(
  null,
  (get, set, { id, productForm }: { id: string; productForm: ProductForm }) => {
    const currentProducts = get(productsAtom);
    const updatedProducts = currentProducts.map((product) =>
      product.id === id ? { ...product, ...productForm } : product,
    );
    set(productsAtom, updatedProducts);
  },
);

// 상품 삭제 액션
export const deleteProductAtom = atom(null, (get, set, id: string) => {
  const currentProducts = get(productsAtom);
  const filteredProducts = currentProducts.filter((product) => product.id !== id);
  set(productsAtom, filteredProducts);
});
