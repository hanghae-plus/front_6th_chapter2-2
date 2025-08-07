import { useState } from 'react';
import { ProductManagement } from '../features/product/admin/ui';
import { CouponManagement } from '../features/coupon/admin/ui';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );

  return (
    <div className='max-w-6xl mx-auto'>
      {/* 관리자 대시보드 헤더 */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
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

      {/* 탭 컨텐츠 */}
      {activeTab === 'products' ? (
        <ProductManagement />
      ) : (
        <CouponManagement />
      )}
    </div>
  );
}
