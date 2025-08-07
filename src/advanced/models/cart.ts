// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
// 5. addItemToCart(cart, product): 상품 추가
// 6. removeItemFromCart(cart, productId): 상품 제거
// 7. getRemainingStock(product, cart): 남은 재고 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

// TODO: 구현

import { CartItem, CartOperationResult, Coupon, OperationResult } from '../../types.ts';
import { ProductWithUI } from '../constants';
import { isSoldOut } from './product.ts';

export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100),
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

export const addItemToCart = (
  cart: CartItem[],
  product: ProductWithUI,
): OperationResult<{ cart: CartItem[] }> => {
  const soldOut = isSoldOut(product, cart);
  if (soldOut) {
    return {
      error: {
        type: 'INSUFFICIENT_STOCK',
        message: '재고가 부족합니다!',
      },
      data: { cart },
    };
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (!existingItem) {
    const updatedCart = [...cart, { product, quantity: 1 }];
    return {
      success: {
        type: 'ADDED_TO_CART',
        message: '장바구니에 담았습니다',
      },
      data: { cart: updatedCart },
    };
  }

  const newQuantity = existingItem.quantity + 1;
  if (newQuantity > product.stock) {
    return {
      error: {
        type: 'STOCK_LIMIT_EXCEEDED',
        message: `재고는 ${product.stock}개까지만 있습니다.`,
      },
      data: { cart },
    };
  }

  const updatedCart = cart.map((item) =>
    item.product.id === product.id ? { ...item, quantity: newQuantity } : item,
  );

  return {
    success: {
      type: 'ADDED_TO_CART',
      message: '장바구니에 담았습니다',
    },
    data: { cart: updatedCart },
  };
};

export const removeItemFromCart = (cart: CartItem[], productId: string): CartOperationResult => {
  const updatedCart = cart.filter((item) => item.product.id !== productId);
  return {
    success: {
      type: 'ITEM_REMOVED',
      message: '상품이 제거되었습니다.',
    },
    data: { cart: updatedCart },
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  products: ProductWithUI[],
  productId: string,
  newQuantity: number,
): CartOperationResult => {
  if (newQuantity <= 0) {
    const result = removeItemFromCart(cart, productId);
    return {
      success: {
        type: 'QUANTITY_UPDATED',
        message: '수량이 변경되었습니다.',
      },
      data: { cart: result.data!.cart },
    };
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return {
      success: {
        type: 'QUANTITY_UPDATED',
        message: '수량이 변경되었습니다.',
      },
      data: { cart },
    };
  }

  const maxStock = product.stock;
  if (newQuantity > maxStock) {
    return {
      error: {
        type: 'STOCK_LIMIT_EXCEEDED',
        message: `재고는 ${maxStock}개까지만 있습니다.`,
      },
      data: { cart },
    };
  }

  const updatedCart = cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item,
  );

  return {
    success: {
      type: 'QUANTITY_UPDATED',
      message: '수량이 변경되었습니다.',
    },
    data: { cart: updatedCart },
  };
};
