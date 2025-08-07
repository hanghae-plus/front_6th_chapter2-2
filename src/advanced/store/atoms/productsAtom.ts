import { atomWithStorage } from 'jotai/utils';
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  initialProducts,
  UPDATE_PRODUCT,
} from '../../shared/constants';
import { Product } from '../../shared/types';
import { atom } from 'jotai';

type ProductAction =
  | { type: typeof ADD_PRODUCT; payload: { product: Omit<Product, 'id'> } }
  | { type: typeof UPDATE_PRODUCT; payload: { product: Partial<Product> } }
  | { type: typeof DELETE_PRODUCT; payload: { productId: string } };

const productReducer = (state: Product[], action: ProductAction) => {
  switch (action.type) {
    // 상품 추가
    case ADD_PRODUCT:
      const newProduct = { ...action.payload.product, id: `p${Date.now()}` };
      return [...state, newProduct];

    // 상품 수정
    case UPDATE_PRODUCT:
      return state.map(product =>
        product.id === action.payload.product.id
          ? { ...product, ...action.payload.product }
          : product
      );

    // 상품 삭제
    case DELETE_PRODUCT:
      return state.filter(product => product.id !== action.payload.productId);

    default:
      return state;
  }
};

const productsStorageAtom = atomWithStorage<Product[]>(
  'products',
  initialProducts
);

export const productsAtom = atom(
  get => get(productsStorageAtom),
  (get, set, action: ProductAction) => {
    const newState = productReducer(get(productsStorageAtom), action);
    set(productsStorageAtom, newState);
  }
);
