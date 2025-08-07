import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  isAdminAtom,
  activeTabAtom,
  showCouponFormAtom,
} from '../atoms/uiAtoms';

/**
 * 전역 UI 상태를 관리하는 커스텀 Hook (Jotai 버전)
 *
 * 관리하는 상태:
 * - isAdmin: 관리자 모드 여부
 * - activeTab: 현재 활성 탭 (products | coupons)
 * - showCouponForm: 쿠폰 폼 표시 여부
 *
 * @returns { isAdmin, activeTab, showCouponForm, setIsAdmin, toggleAdmin, setActiveTab, setShowCouponForm }
 */
export const useUIState = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [showCouponForm, setShowCouponForm] = useAtom(showCouponFormAtom);

  const onToggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, [setIsAdmin]);

  const onSetActiveTab = useCallback(
    (tab: 'products' | 'coupons') => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

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
