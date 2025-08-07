import { useAtom } from 'jotai';

import { activeTabAtom } from '../atoms/uiAtoms';
import { AdminCouponManagement } from './admin/AdminCouponManagement';
import { AdminDashboardTabList } from './admin/AdminDashboardTabList';
import { AdminProductManagement } from './admin/AdminProductManagement';

const AdminPage = () => {
  // atoms 직접 사용
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>관리자 대시보드</h1>
        <p className='text-gray-600'>상품과 쿠폰을 관리하고 주문을 확인하세요.</p>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <AdminDashboardTabList activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className='p-6'>
          {activeTab === 'products' ? <AdminProductManagement /> : <AdminCouponManagement />}
        </div>
      </div>
    </div>
  );
};

export { AdminPage };
