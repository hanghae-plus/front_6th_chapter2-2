import { useState } from 'react';
import Button from '../ui/Button.tsx';
import ProductTab from '../admin/ProductTab.tsx';
import CouponTab from '../admin/CouponTab.tsx';

const AdminView = () => {
  // AdminView 전용 상태들
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );

  const getButtonStyle = (tab: 'products' | 'coupons') => {
    return activeTab === tab
      ? 'border-gray-900 text-gray-900'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <Button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${getButtonStyle(
              'products'
            )}`}
          >
            상품 관리
          </Button>
          <Button
            onClick={() => setActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${getButtonStyle(
              'coupons'
            )}`}
          >
            쿠폰 관리
          </Button>
        </nav>
      </div>

      {activeTab === 'products' ? <ProductTab /> : <CouponTab />}
    </div>
  );
};

export default AdminView;
