// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수

import { createContext, useCallback, useEffect, useState } from 'react'
import { CartItem, Coupon } from '../../types'
import { ProductWithUI } from '../types'
import {
  getRemainingStock as _getRemainingStock,
  calculateItemTotal,
  calculateCartTotal as _calculateCartTotal,
  addItemToCart,
} from '../models/cart'
import { useLocalStorage } from '../utils/hooks/useLocalStorage'
import { MIN_COUPON_AMOUNT } from '../constants'
import { CartItemContext } from '../types/context'

export const CartContext = createContext<CartItemContext | undefined>(undefined)

export function useCart(
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
  ) => void,
) {
  // TODO: 구현

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', [])

  const getRemainingStock = useCallback(
    (product: ProductWithUI) => {
      return _getRemainingStock(product, cart)
    },
    [cart],
  )

  const calculateTotal = useCallback(
    (item: CartItem) => {
      return calculateItemTotal(item, cart)
    },
    [cart],
  )

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = _getRemainingStock(product, cart)
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error')
        return
      }

      const { carts, message, type } = addItemToCart(cart, product)

      setCart(carts)
      addNotification(message, type)
    },
    [addNotification, cart, setCart],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId),
      )
    },
    [setCart],
  )

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products: ProductWithUI[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId)
        return
      }

      const product = products.find((p) => p.id === productId)
      if (!product) return

      const maxStock = product.stock
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error')
        return
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      )
    },
    [setCart, removeFromCart, addNotification],
  )

  const calculateCartTotal = useCallback((): {
    totalBeforeDiscount: number
    totalAfterDiscount: number
  } => {
    return _calculateCartTotal(cart, selectedCoupon)
  }, [cart, selectedCoupon])

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = _calculateCartTotal(
        cart,
        selectedCoupon,
      ).totalAfterDiscount

      if (
        currentTotal < MIN_COUPON_AMOUNT &&
        coupon.discountType === 'percentage'
      ) {
        addNotification(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          'error',
        )
        return
      }

      setSelectedCoupon(coupon)
      addNotification('쿠폰이 적용되었습니다.', 'success')
    },
    [addNotification, cart, selectedCoupon],
  )

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success',
    )
    setCart([])
    setSelectedCoupon(null)
  }, [addNotification, setCart, setSelectedCoupon])

  const handleSelectCoupon = (
    e: React.ChangeEvent<HTMLSelectElement>,
    coupons: Coupon[],
  ) => {
    const coupon = coupons.find((c) => c.code === e.target.value)
    if (coupon) applyCoupon(coupon)
    else setSelectedCoupon(null)
  }

  const [totalItemCount, setTotalItemCount] = useState(0)

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    setTotalItemCount(count)
  }, [cart])

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    calculateCartTotal,
    calculateTotal,
    completeOrder,
    getRemainingStock,
    handleSelectCoupon,
    totalItemCount,
  }
}
