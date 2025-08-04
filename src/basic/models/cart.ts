// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산 !
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산 !
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액) !
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경 !
// 5. addItemToCart(cart, product): 상품 추가 !
// 6. removeItemFromCart(cart, productId): 상품 제거 !
// 7. getRemainingStock(product, cart): 남은 재고 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { ICartItem, ICoupon, IProductWithUI } from "../type";

export const cartModel = {
  // 적용 가능한 최대 할인율 계산
  getMaxApplicableDiscount: (item: ICartItem, cart: ICartItem[]): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    // 기본 할인율 계산
    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    // 10개 이상 구매하는 상품이 있는지 확인 (대량 구매)
    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인 (최대 할인율 - 50%)
    }

    return baseDiscount;
  },

  // 개별 아이템의 할인 적용 후 총액 계산
  calculateItemTotal: (item: ICartItem, cart: ICartItem[]): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = cartModel.getMaxApplicableDiscount(item, cart);

    return Math.round(price * quantity * (1 - discount));
  },

  // 장바구니 총액 계산 (할인 전/후, 할인액)
  calculateCartTotal: (
    cart: ICartItem[],
    selectedCoupon?: ICoupon
  ): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += cartModel.calculateItemTotal(item, cart);
    });

    // 선택된 쿠폰이 있으면 쿠폰 적용
    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  },

  // 수량 변경
  updateCartItemQuantity: (
    cart: ICartItem[],
    productId: string,
    quantity: number
  ): ICartItem[] => {
    if (quantity <= 0) {
      // 수량 0 이하면 장바구니에서 제거
      return cart.filter((item) => item.product.id !== productId);
    }

    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: quantity } : item
    );
  },

  // 상품 추가
  addItemToCart: (cart: ICartItem[], product: IProductWithUI): ICartItem[] => {
    // 이미 장바구니에 존재하는 상품 처리
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;

      // 재고 초과 시 기존 cart 반환
      if (newQuantity > product.stock) {
        return cart;
      }

      // 수량만 업데이트
      return cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
    }

    // 장바구니에 없는 상품이면 새 아이템 추가
    return [...cart, { product, quantity: 1 }];
  },

  // 상품 제거
  removeItemFromCart: (cart: ICartItem[], productId: string): ICartItem[] => {
    return cart.filter((item) => item.product.id !== productId);
  },

  // 남은 재고 계산
  getRemainingStock: (product: IProductWithUI, cart: ICartItem[]): number => {
    // 상품 재고 수 - 카트에 담긴 상품 수
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  },
};
