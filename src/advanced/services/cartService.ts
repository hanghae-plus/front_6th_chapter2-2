import { CartItem, ProductWithUI } from '../types';

// services/cartService.ts
export const cartService = {
  // 장바구니에 상품 추가 로직
  addItemToCart: (product: ProductWithUI, cart: CartItem[]) => {
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      return cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...cart, { product, quantity: 1 }];
  },

  // 장바구니에서 상품 제거 로직
  removeItemFromCart: (productId: string, cart: CartItem[]) => {
    return cart.filter(item => item.product.id !== productId);
  },

  // 수량 업데이트 로직
  updateItemQuantity: (
    productId: string,
    newQuantity: number,
    cart: CartItem[]
  ) => {
    return cart.map(item =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );
  },

  // 총 아이템 개수 계산
  calculateTotalItemCount: (cart: CartItem[]) => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
};
