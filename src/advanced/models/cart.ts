// 장바구니 비즈니스 로직 (순수 함수)
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

import { CartItem, Product } from "../../types";
import { ProductWithUI } from "../App";

const hasBulkPurchase = (x: CartItem[]) =>
  x.some((item) => item.quantity >= 10);

const getMaxApplicableDiscount = ({
  discounts,
  quantity,
  hasBulkPurchase,
}: {
  discounts: CartItem["product"]["discounts"];
  quantity: number;
  hasBulkPurchase: boolean;
}): number => {
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

const calculateItemTotal = ({
  item,
  discount,
}: {
  item: CartItem;
  discount: number;
}): number => {
  const { price } = item.product;
  const { quantity } = item;

  return Math.round(price * quantity * (1 - discount));
};

const updateCartItemQuantity = ({
  products,
  cart,
  productId,
  newQuantity,
}: {
  products: ProductWithUI[];
  cart: CartItem[];
  productId: string;
  newQuantity: number;
}) => {
  if (newQuantity <= 0) {
    return {
      success: false,
      message: "재고가 부족합니다!",
      cart: cart,
    };
  }

  const product = products.find((p) => p.id === productId);
  if (!product)
    return {
      success: false,
      message: "상품을 찾을 수 없습니다.",
      cart: cart,
    };

  const maxStock = product.stock;
  if (newQuantity > maxStock) {
    return {
      success: false,
      message: `재고는 ${maxStock}개까지만 있습니다.`,
      cart: cart,
    };
  }

  const newCart = cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
  return {
    success: true,
    message: "장바구니에 담았습니다",
    cart: newCart,
  };
};

const addItemToCart = ({
  cart,
  product,
}: {
  cart: CartItem[];
  product: ProductWithUI;
}) => {
  const remainingStock = getRemainingStock({ product, cart });
  if (remainingStock <= 0) {
    return {
      success: false,
      message: "재고가 부족합니다!",
      cart: cart,
    };
  }

  const existingItem = cart.find((item) => item.product.id === product.id);
  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > product.stock) {
      return {
        success: false,
        message: `재고는 ${product.stock}개까지만 있습니다.`,
        cart: cart,
      };
    }

    const newCart = cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
    return {
      success: true,
      message: "장바구니에 담았습니다",
      cart: newCart,
    };
  }

  return {
    success: true,
    message: "장바구니에 담았습니다",
    cart: [...cart, { product, quantity: 1 }],
  };
};

const removeItemFromCart = ({
  cart,
  productId,
}: {
  cart: CartItem[];
  productId: string;
}) => {
  const newCart = cart.filter((item) => item.product.id !== productId);

  return {
    success: true,
    message: "",
    cart: newCart,
  };
};

const getRemainingStock = ({
  product,
  cart,
}: {
  product: Product;
  cart: CartItem[];
}): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

export {
  addItemToCart,
  removeItemFromCart,
  getRemainingStock,
  updateCartItemQuantity,
  calculateItemTotal,
  getMaxApplicableDiscount,
  hasBulkPurchase,
};
