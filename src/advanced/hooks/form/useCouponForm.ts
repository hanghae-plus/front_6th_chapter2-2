import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import {
  couponFormAtom,
  showCouponFormAtom,
  handleCouponFormSubmitAtom,
  updateCouponFormAtom,
  updateShowCouponFormAtom,
} from '../../atoms/formAtoms';
import { Coupon } from '../../types';

const useCouponForm = () => {
  // atoms 구독
  const [couponForm] = useAtom(couponFormAtom);
  const [showCouponForm] = useAtom(showCouponFormAtom);

  // action atoms
  const handleCouponFormSubmitAction = useSetAtom(handleCouponFormSubmitAtom);
  const updateCouponFormAction = useSetAtom(updateCouponFormAtom);
  const updateShowCouponFormAction = useSetAtom(updateShowCouponFormAtom);

  // wrapper 함수들
  const handleCouponFormSubmit = useCallback(() => {
    handleCouponFormSubmitAction();
  }, [handleCouponFormSubmitAction]);

  const updateCouponForm = useCallback(
    (form: Partial<Coupon>) => {
      updateCouponFormAction(form);
    },
    [updateCouponFormAction],
  );

  const updateShowCouponForm = useCallback(
    (show: boolean) => {
      updateShowCouponFormAction(show);
    },
    [updateShowCouponFormAction],
  );

  return {
    couponForm,
    showCouponForm,
    handleCouponFormSubmit,
    updateCouponForm,
    updateShowCouponForm,
  };
};

export { useCouponForm };
