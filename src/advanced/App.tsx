import { useState, useEffect, useMemo } from 'react';
import { Provider, createStore } from 'jotai';
import Header from './components/Header';
import NotificationContainer from './components/NotificationContainer';
import AdminPage from './components/AdminPage';
import CustomerPage from './components/CustomerPage';
import Layout from './components/Layout';
import { useAdmin } from './store/hooks';

const AppContent = () => {
  const { isAdmin } = useAdmin();

  return (
    <Layout Header={<Header />} NotificationContainer={<NotificationContainer />}>
      {isAdmin ? <AdminPage /> : <CustomerPage />}
    </Layout>
  );
};

const App = () => {
  // Provider를 강제로 재마운트하기 위한 key 생성
  const [providerKey, setProviderKey] = useState(0);

  // localStorage.clear() 시 Provider 재마운트
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalClear = localStorage.clear;
      localStorage.clear = function () {
        originalClear.call(this);
        setProviderKey(prev => prev + 1);
      };

      return () => {
        localStorage.clear = originalClear;
      };
    }
  }, []);

  // 모든 환경에서 명시적으로 store 생성
  const store = useMemo(() => {
    return createStore();
  }, [providerKey]);

  return (
    <Provider key={providerKey} store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
