import { atomWithStorage } from 'jotai/utils';
import { CartItem, Product } from '../../shared/types';
import {
  ADD_TO_CART,
  CLEAR_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
} from '../../shared/constants';
import { atom } from 'jotai';

type CartAction =
  | { type: typeof ADD_TO_CART; payload: { product: Product } }
  | { type: typeof REMOVE_FROM_CART; payload: { productId: string } }
  | {
      type: typeof UPDATE_QUANTITY;
      payload: { productId: string; quantity: number };
    }
  | { type: typeof CLEAR_CART };

const cartReducer = (state: CartItem[], action: CartAction) => {
  switch (action.type) {
    // 장바구니에 상품 추가
    case ADD_TO_CART:
      const existingItem = state.find(
        item => item.product.id === action.payload.product.id
      );
      if (existingItem) {
        return state.map(item =>
          item.product.id === action.payload.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { product: action.payload.product, quantity: 1 }];

    // 장바구니에서 상품 제거
    case REMOVE_FROM_CART:
      return state.filter(item => item.product.id !== action.payload.productId);

    // 장바구니에서 상품 수량 업데이트
    case UPDATE_QUANTITY:
      return state.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    // 장바구니 초기화
    case CLEAR_CART:
      return [];

    default:
      return state;
  }
};

const cartStorageAtom = atomWithStorage<CartItem[]>('cart', []);

export const cartAtom = atom(
  get => get(cartStorageAtom),
  (get, set, action: CartAction) => {
    const newState = cartReducer(get(cartStorageAtom), action);
    set(cartStorageAtom, newState);
  }
);
