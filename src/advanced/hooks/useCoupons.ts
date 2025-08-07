// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { createContext, useCallback } from 'react'
import { initialCoupons } from '../constants'
import { Coupon } from '../../types'
import { useLocalStorage } from '../utils/hooks/useLocalStorage'
import { CouponContext } from '../types/context'

export const CouponsContext = createContext<CouponContext | undefined>(
  undefined,
)

export function useCoupons(
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
  ) => void,
  selectedCoupon: Coupon | null,
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>,
) {
  // TODO: 구현

  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons,
  )

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code)
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error')
        return
      }
      setCoupons((prev) => [...prev, newCoupon])
      addNotification('쿠폰이 추가되었습니다.', 'success')
    },
    [coupons, setCoupons, addNotification],
  )

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode))
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null)
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success')
    },
    [setCoupons, selectedCoupon?.code, addNotification, setSelectedCoupon],
  )

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  }
}
