import { useState } from 'react';

export function useCouponFormVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  const handleShowCouponForm = () => {
    setIsVisible(true);
  };

  const handleHideCouponForm = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    handleShowCouponForm,
    handleHideCouponForm,
  };
}
