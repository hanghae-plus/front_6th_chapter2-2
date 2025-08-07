import { AdminPage } from './admin';
import { UserPage } from './user';
import { Notifications } from './shared/components/Notifications';
import { Header } from './shared/components/Header';
import { Provider, useAtomValue } from 'jotai';
import { isAdminAtom } from './store/atoms/appAtom';

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

const AppContent = () => {
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 */}
      <Notifications />

      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <UserPage />}
      </main>
    </div>
  );
};

export default App;
