import { useAtomValue, useSetAtom } from 'jotai';
import type { Coupon } from '../../../types';
import {
  addCouponAtom,
  applyCouponAtom,
  clearSelectedCouponAtom,
  couponsAtom,
  deleteCouponAtom,
  selectedCouponAtom,
} from './atoms';
import { initialCoupons } from '../../constants';
import { useAtomWithLocalStorage } from '../../utils/hooks/useLocalStorage';
import { useNotify } from '../notification/hooks';

export function useCoupons(): Coupon[] {
  const [coupons] = useAtomWithLocalStorage({
    key: 'coupons',
    initialValue: initialCoupons,
    atom: couponsAtom,
  });

  return coupons;
}

export function useAddCoupon() {
  const notify = useNotify();
  const _addCoupon = useSetAtom(addCouponAtom);

  const addCoupon = ({ newCoupon }: { newCoupon: Coupon }) => {
    const { message, success } = _addCoupon({ newCoupon });

    notify({ message, type: success ? 'success' : 'error' });
  };

  return addCoupon;
}

export function useDeleteCoupon() {
  const notify = useNotify();
  const _deleteCoupon = useSetAtom(deleteCouponAtom);

  const deleteCoupon = ({ couponCode }: { couponCode: string }) => {
    const { message, success } = _deleteCoupon({ couponCode });

    notify({ message, type: success ? 'success' : 'error' });
  };

  return deleteCoupon;
}

export function useApplyCoupon() {
  const notify = useNotify();
  const _applyCoupon = useSetAtom(applyCouponAtom);

  const applyCoupon = ({ coupon }: { coupon: Coupon }) => {
    const { message, success } = _applyCoupon({ coupon });

    notify({ message, type: success ? 'success' : 'error' });
  };

  return applyCoupon;
}

export function useSelectedCoupon() {
  return useAtomValue(selectedCouponAtom);
}

export function useClearSelectedCoupon() {
  return useSetAtom(clearSelectedCouponAtom);
}
