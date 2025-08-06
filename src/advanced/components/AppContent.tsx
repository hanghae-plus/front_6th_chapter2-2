import { useAtom, useAtomValue } from 'jotai';
import { notificationsAtom } from '../atoms/notificationsAtoms';
import { isAdminAtom } from '../atoms/uiAtoms';
import Toast from '../../basic/components/ui/Toast';
import Header from './ui/Header';
import AdminDashboard from './admin/AdminDashboard';
import ShopView from './user/ShopView';

export default function AppContent() {
  // 기본 데이터 관리
  const [notifications] = useAtom(notificationsAtom);

  // UI 상태 관리
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          {notifications.map((notification) => {
            return (
              <Toast
                key={notification.id}
                type={notification.type}
                message={notification.message}
              />
            );
          })}
        </div>
      )}
      <Header />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? <AdminDashboard /> : <ShopView />}
      </main>
    </div>
  );
}
