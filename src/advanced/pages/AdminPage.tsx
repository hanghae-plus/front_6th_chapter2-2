import { useActiveTab } from '../../shared/hooks';
import { Tab } from '../../shared/components';
import { ProductList } from '../components/product';
import { CouponList } from '../components/coupon';

interface AdminPageProps {
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export function AdminPage({ addNotification }: AdminPageProps) {
  const { activeTab, handleSwitchTab } = useActiveTab();

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader />

      <Tab activeTab={activeTab} onSwitchTab={handleSwitchTab} />

      {activeTab === 'products' ? (
        <ProductList />
      ) : (
        <CouponList addNotification={addNotification} />
      )}
    </div>
  );
}

function AdminHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
      <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
    </div>
  );
}
