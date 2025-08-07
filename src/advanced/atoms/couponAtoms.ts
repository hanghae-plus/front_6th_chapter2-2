import { atom } from 'jotai';
import { CouponType } from '@/types';

// 쿠폰 목록
export const couponsAtom = atom<CouponType[]>([]);

// 선택된 쿠폰
export const selectedCouponAtom = atom<CouponType | null>(null);
