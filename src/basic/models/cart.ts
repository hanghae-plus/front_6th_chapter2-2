import { CartItem, Coupon, Product } from '../../types';

// 장바구니 비즈니스 로직 (순수 함수)

// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

export const cartModel = {
  // 개별 아이템의 할인 적용 후 총액 계산
  calculateItemTotal: (item: CartItem) => {
    return item.product.price * item.quantity;
  },

  // 적용 가능한 최대 할인율 계산
  getMaxApplicableDiscount: (item: CartItem) => {
    return item.product.discounts.reduce((max, discount) => {
      return Math.max(max, discount.rate);
    }, 0);
  },

  // 장바구니 총액 계산 (할인 전/후, 할인액)
  calculateCartTotal: (cart: CartItem[], selectedCoupon: Coupon) => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = cartModel.calculateItemTotal(item);
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += itemPrice;
    });

    // 할인 적용
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
  },

  // 수량 변경
  updateCartItemQuantity: (cart: CartItem[], productId: string, quantity: number) => {
    return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
  },

  // 상품 추가
  addItemToCart: (cart: CartItem[], product: Product) => {
    return [...cart, { product, quantity: 1 }];
  },

  // 상품 제거
  removeItemFromCart: (cart: CartItem[], productId: string) => {
    return cart.filter((item) => item.product.id !== productId);
  },

  // 남은 재고 계산
  getRemainingStock: (product: Product, cart: CartItem[]) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  },
};
