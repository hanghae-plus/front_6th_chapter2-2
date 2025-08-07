import { useCallback, useState } from 'react';
/**
 * 전역 UI 상태를 관리하는 커스텀 Hook
 *
 * 관리하는 상태:
 * - isAdmin: 관리자 모드 여부
 * - activeTab: 현재 활성 탭 (products | coupons)
 * - showCouponForm: 쿠폰 폼 표시 여부
 *
 * @returns { isAdmin, activeTab, showCouponForm, setIsAdmin, toggleAdmin, setActiveTab, setShowCouponForm }
 */
export const useUIState = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, onSetActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );
  const [showCouponForm, setShowCouponForm] = useState(false);

  const onToggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  return {
    isAdmin,
    activeTab,
    showCouponForm,
    setIsAdmin,
    onToggleAdmin,
    onSetActiveTab,
    setShowCouponForm,
  };
};
