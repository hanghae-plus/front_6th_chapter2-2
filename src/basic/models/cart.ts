// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
// 5. addItemToCart(cart, product): 상품 추가
// 6. getRemainingStock(product, cart): 남은 재고 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { CartItem, Coupon, Product } from '../../types'
import { ProductWithUI } from '../types'
import { calculateDiscountedTotal } from './coupon'
// TODO: 구현

export const getRemainingStock = (
  product: Product,
  cart: CartItem[],
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id)
  const remaining = product.stock - (cartItem?.quantity || 0)

  return remaining
}

const getBasicDiscount = (item: CartItem) => {
  const { discounts } = item.product
  const { quantity } = item

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount
  }, 0)
}

export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[],
): number => {
  const baseDiscount = getBasicDiscount(item)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10)
  return hasBulkPurchase ? Math.min(baseDiscount + 0.05, 0.5) : baseDiscount
}

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[],
): number => {
  const { price } = item.product
  const { quantity } = item
  const discount = getMaxApplicableDiscount(item, cart)

  return Math.round(price * quantity * (1 - discount))
}

export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null,
): { totalBeforeDiscount: number; totalAfterDiscount: number } => {
  let totalBeforeDiscount = 0
  let totalAfterDiscount = 0

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity
    totalBeforeDiscount += itemPrice
    totalAfterDiscount += calculateItemTotal(item, cart)
  })

  if (coupon) {
    totalAfterDiscount = calculateDiscountedTotal(totalAfterDiscount, coupon)
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  }
}

export const addItemToCart = (
  carts: CartItem[],
  product: ProductWithUI,
): {
  carts: CartItem[]
  message: string
  type: 'error' | 'success' // 명확한 타입
} => {
  const existingItem = carts.find((item) => item.product.id === product.id)

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1

    if (newQuantity > product.stock) {
      return {
        carts: carts,
        message: `재고는 ${product.stock}개까지만 있습니다.`,
        type: 'error',
      }
    }

    return {
      carts: carts.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item,
      ),
      message: '장바구니에 담았습니다',
      type: 'success',
    }
  }

  return {
    carts: [...carts, { product, quantity: 1 }],
    message: '장바구니에 담았습니다',
    type: 'success',
  }
}
