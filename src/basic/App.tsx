import { useState, useCallback } from 'react';
import { Button } from './components/ui/Button';
import { Notification as UINotification } from './components/ui/Notification';
import { Notification } from '../types';
import { ShoppingPage } from './components/pages/ShoppingPage';
import { AdminPage } from './components/pages/AdminPage';

const App = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <UINotification
              key={notif.id}
              message={notif.message}
              type={notif.type}
              onClose={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notif.id)
                )
              }
            />
          ))}
        </div>
      )}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAdmin(!isAdmin)}
                variant={isAdmin ? 'primary' : 'secondary'}
                className="text-sm"
              >
                {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage addNotification={addNotification} />
        ) : (
          <ShoppingPage addNotification={addNotification} />
        )}
      </main>
    </div>
  );
};

export default App;
