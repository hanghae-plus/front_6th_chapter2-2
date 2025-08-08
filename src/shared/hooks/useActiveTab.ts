import { useState } from 'react';

type Tab = 'products' | 'coupons';

export function useActiveTab() {
  const [activeTab, setActiveTab] = useState<Tab>('products');

  const handleSwitchTab = (tab: Tab) => {
    setActiveTab(tab);
  };

  return {
    activeTab,

    // Actions
    handleSwitchTab,

    // Computed
    isProductsTabActive: activeTab === 'products',
    isCouponsTabActive: activeTab === 'coupons',
  };
}
