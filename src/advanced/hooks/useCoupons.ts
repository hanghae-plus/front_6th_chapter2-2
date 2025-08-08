import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { Coupon } from "../../types.ts"
import { initialCoupons } from "../data/coupons.ts"

const atomCoupons = atomWithStorage<Coupon[]>("coupons", initialCoupons)
const atomSelectedCoupon = atomWithStorage<Coupon | null>("selectedCoupon", null)

export function useCoupons() {
  const [coupons, setCoupons] = useAtom(atomCoupons)

  const [selectedCoupon, setSelectedCoupon] = useAtom(atomSelectedCoupon)

  return { coupons, setCoupons, selectedCoupon, setSelectedCoupon }
}
