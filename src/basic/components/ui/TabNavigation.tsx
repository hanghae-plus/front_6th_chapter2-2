interface TabNavigationProps {
  activeTab: 'products' | 'coupons';
  handleClickProductTab: () => void;
  handleClickCouponTab: () => void;
}

export function TabNavigation({
  activeTab,
  handleClickProductTab,
  handleClickCouponTab,
}: TabNavigationProps) {
  return (
    <div className='border-b border-gray-200 mb-6'>
      <nav className='-mb-px flex space-x-8'>
        <button
          onClick={handleClickProductTab}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'products'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          상품 관리
        </button>
        <button
          onClick={handleClickCouponTab}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'coupons'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          쿠폰 관리
        </button>
      </nav>
    </div>
  );
}
