import { Provider, useAtom } from 'jotai';

import Header from './components/Header';
import Notification from './components/Notification';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';
import { cartAtom, isAdminAtom, notificationsAtom } from './store/atoms';

// TODO: 메인 App 컴포넌트
// 힌트:
// 1. isAdmin 상태를 관리하여 쇼핑몰/관리자 모드 전환
// 2. 네비게이션 바에 모드 전환 버튼 포함
// 3. 조건부 렌더링으로 CartPage 또는 AdminPage 표시
// 4. 상태 관리는 각 페이지 컴포넌트에서 처리 (App은 라우팅만 담당)

const App = () => {
  const [
    /* cart */
  ] = useAtom(cartAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [notifications] = useAtom(notificationsAtom);

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && <Notification />}

      <Header />

      <main className='max-w-7xl mx-auto px-4 py-8'>{isAdmin ? <AdminPage /> : <CartPage />}</main>
    </div>
  );
};

const ProviderApp = () => (
  <Provider>
    <App />
  </Provider>
);

export default ProviderApp;
