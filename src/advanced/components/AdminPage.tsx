import { useAtom } from 'jotai';

import { activeTabAtom } from '../atoms/uiAtoms';
import { AdminCouponManagement } from './admin/AdminCouponManagement';
import { AdminDashboardTabList } from './admin/AdminDashboardTabList';
import { AdminProductManagement } from './admin/AdminProductManagement';

const AdminPage = () => {
  // atoms 직접 사용
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <AdminDashboardTabList activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'products' ? <AdminProductManagement /> : <AdminCouponManagement />}
    </div>
  );
};

export { AdminPage };
