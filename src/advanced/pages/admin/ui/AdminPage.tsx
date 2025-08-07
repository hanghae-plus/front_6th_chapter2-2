import { useState } from 'react';

import { CouponTab } from '../../../components/ui/CouponTab';
import { ProductTab } from '../../../components/ui/ProductTab';
import { TabNavigation } from '../../../components/ui/TabNavigation';
import { AdminHeader } from '../../../widgets/admin-header';

interface AdminPageProps {
  onChangeCartPage: () => void;
}

export function AdminPage({ onChangeCartPage }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  return (
    <>
      <AdminHeader onChangeCartPage={onChangeCartPage} />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
            <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
          </div>
          <TabNavigation
            activeTab={activeTab}
            handleClickProductTab={() => setActiveTab('products')}
            handleClickCouponTab={() => setActiveTab('coupons')}
          />

          {(() => {
            if (activeTab === 'products') {
              return <ProductTab />;
            }

            return <CouponTab />;
          })()}
        </div>
      </main>
    </>
  );
}
