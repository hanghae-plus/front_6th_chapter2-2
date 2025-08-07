import { useState } from 'react';
import ProductManagement from './ProductManagement';
import Tab from '../ui/Tab';
import CouponsManagement from './CouponsManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <Tab isActive={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            상품 관리
          </Tab>
          <Tab isActive={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')}>
            쿠폰 관리
          </Tab>
        </nav>
      </div>

      {activeTab === 'products' ? <ProductManagement /> : <CouponsManagement />}
    </div>
  );
}
