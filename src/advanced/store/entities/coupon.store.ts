import { atomWithStorage } from 'jotai/utils';
import { Coupon } from '../../models/entities';
import { atom } from 'jotai';
import { calculateCartTotal } from '../../utils/calulator.ts';
import { cartAtom } from './cart.store.ts';
import { addNotificationAtom } from '../common/notification.store.ts';
// 초기 쿠폰 데이터
const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);
export const selectedCouponAtom = atom<Coupon | null>(null);
export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  const coupons = get(couponsAtom);
  const existingCoupon = coupons.find(c => c.code === newCoupon.code);

  // 중복 체크
  if (existingCoupon) {
    set(addNotificationAtom, {
      message: '이미 존재하는 쿠폰 코드입니다.',
      type: 'error',
    });
    return;
  }

  // 쿠폰 추가
  set(couponsAtom, [...coupons, newCoupon]);

  // 성공 알림
  set(addNotificationAtom, {
    message: '쿠폰이 추가되었습니다.',
    type: 'success',
  });
});

// 🎯 쿠폰 삭제 액션 atom (선택된 쿠폰도 함께 처리)
export const deleteCouponAtom = atom(null, (get, set, couponCode: string) => {
  const coupons = get(couponsAtom);
  const selectedCoupon = get(selectedCouponAtom);

  // 쿠폰 삭제
  const filteredCoupons = coupons.filter(c => c.code !== couponCode);
  set(couponsAtom, filteredCoupons);

  // 선택된 쿠폰이 삭제된 쿠폰이면 선택 해제
  if (selectedCoupon?.code === couponCode) {
    set(selectedCouponAtom, null);
  }

  // 성공 알림
  set(addNotificationAtom, {
    message: '쿠폰이 삭제되었습니다.',
    type: 'success',
  });
});

// 🎯 쿠폰 적용 액션 atom (복잡한 비즈니스 로직)
export const applyCouponAtom = atom(null, (get, set, coupon: Coupon) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);

  // 현재 총 금액 계산 (기존 쿠폰 적용된 상태에서)
  const currentTotal = calculateCartTotal(
    cart,
    selectedCoupon
  ).totalAfterDiscount;

  // 퍼센트 쿠폰은 10,000원 이상 구매시에만 사용 가능
  if (currentTotal < 10000 && coupon.discountType === 'percentage') {
    set(addNotificationAtom, {
      message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
      type: 'error',
    });
    return;
  }

  // 쿠폰 적용
  set(selectedCouponAtom, coupon);

  // 성공 알림
  set(addNotificationAtom, {
    message: '쿠폰이 적용되었습니다.',
    type: 'success',
  });
});

// 🎯 쿠폰 선택 해제 액션 atom
export const resetCouponAtom = atom(null, (_get, set) => {
  set(selectedCouponAtom, null);
});

// 🎯 파생 atoms - 계산 및 상태용
export const availableCouponsAtom = atom(get => {
  const coupons = get(couponsAtom);
  const cart = get(cartAtom);
  const currentTotal = calculateCartTotal(cart, null).totalBeforeDiscount;

  // 사용 가능한 쿠폰만 필터링 (금액 조건 확인)
  return coupons.filter(coupon => {
    if (coupon.discountType === 'percentage' && currentTotal < 10000) {
      return false;
    }
    return true;
  });
});

export const couponDiscountAmountAtom = atom(get => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);

  if (!selectedCoupon) return 0;

  const { totalAfterDiscount, totalBeforeDiscount } = calculateCartTotal(
    cart,
    selectedCoupon
  );
  return totalBeforeDiscount - totalAfterDiscount;
});

export const isCouponAppliedAtom = atom(get => {
  const selectedCoupon = get(selectedCouponAtom);
  return selectedCoupon !== null;
});
