import { useState, useCallback } from 'react';
import Header from './components/Header';
import NotificationContainer from './components/NotificationContainer';
import AdminPage from './components/AdminPage';
import CustomerPage from './components/CustomerPage';
import { useNotification } from './hooks/useNotification';
import { useSearchTerm } from './hooks/useSearchTerm';
import Layout from './components/Layout';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotification();
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearchTerm();
  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  return (
    <Layout
      Header={
        <Header isAdmin={isAdmin} searchTerm={searchTerm} setSearchTerm={setSearchTerm} toggleAdmin={toggleAdmin} />
      }
      NotificationContainer={
        <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      }
    >
      {isAdmin ? (
        <AdminPage addNotification={addNotification} />
      ) : (
        <CustomerPage debouncedSearchTerm={debouncedSearchTerm} addNotification={addNotification} />
      )}
    </Layout>
  );
};

export default App;
