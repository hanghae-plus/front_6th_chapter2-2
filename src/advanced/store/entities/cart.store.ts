import { atomWithStorage } from 'jotai/utils';
import { CartItem } from '../../models/entities';
import { atom } from 'jotai';
import { ProductWithUI } from '../../App.tsx';
import { getRemainingStock } from '../../utils/formatters.ts';
import { addNotificationAtom } from '../common/notification.store.ts';
import { productAtom } from './product.store.ts';

export const cartAtom = atomWithStorage<CartItem[]>('cart', [], undefined, {
  getOnInit: true,
});

export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  const currentCartItem = get(cartAtom);
  const cartItem = currentCartItem.find(item => item.product.id === product.id);

  const remainingStock = getRemainingStock(product, cartItem?.quantity);

  if (remainingStock <= 0) {
    set(addNotificationAtom, {
      message: '재고가 부족합니다!',
      type: 'error',
    });
  }

  const existingItem = currentCartItem.find(
    item => item.product.id === product.id
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    // 재고 한도 체크
    if (newQuantity > product.stock) {
      set(addNotificationAtom, {
        message: `재고는 ${product.stock}개까지만 있습니다.`,
        type: 'error',
      });
      return;
    }

    // 수량 증가
    const updatedCart = currentCartItem.map(item =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
    set(cartAtom, updatedCart);
  } else {
    // 새 아이템 추가
    set(cartAtom, [...currentCartItem, { product, quantity: 1 }]);
  }

  // 성공 알림
  set(addNotificationAtom, {
    message: '장바구니에 담았습니다',
    type: 'success',
  });
});

export const removeFromCartAtom = atom(null, (get, set, productId) => {
  const cart = get(cartAtom);
  const updatedCart = cart.filter(item => item.product.id !== productId);
  set(cartAtom, updatedCart);
});

// 🎯 수량 업데이트 액션 atom
export const updateQuantityAtom = atom(
  null,
  (
    get,
    set,
    { productId, newQuantity }: { productId: string; newQuantity: number }
  ) => {
    // 수량이 0 이하면 제거
    if (newQuantity <= 0) {
      set(removeFromCartAtom, productId);
      return;
    }

    const products = get(productAtom);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    // 재고 한도 체크
    if (newQuantity > product.stock) {
      set(addNotificationAtom, {
        message: `재고는 ${product.stock}개까지만 있습니다.`,
        type: 'error',
      });
      return;
    }

    const cart = get(cartAtom);
    const updatedCart = cart.map(item =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );
    set(cartAtom, updatedCart);
  }
);

// 🎯 장바구니 초기화 액션 atom
export const resetCartAtom = atom(null, (_get, set) => {
  set(cartAtom, []);
});

// 🎯 파생 atoms - 계산용
export const cartTotalCountAtom = atom(get => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const cartTotalPriceAtom = atom(get => {
  const cart = get(cartAtom);
  return cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
});
