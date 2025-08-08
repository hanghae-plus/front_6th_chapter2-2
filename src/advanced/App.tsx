import { useState } from 'react';
import { Button } from './components/ui/Button';
import { Notification as UINotification } from './components/ui/Notification';
import { ShoppingPage } from './components/pages/ShoppingPage';
import { AdminPage } from './components/pages/AdminPage';
import { useNotifications } from './hooks/useNotifications';

const App = () => {
  const { notification } = useNotifications();
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          <UINotification
            message={notification.message}
            type={notification.type}
            onClose={() => {
              /* Handled by atom's setTimeout */
            }}
          />
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
        {isAdmin ? <AdminPage /> : <ShoppingPage />}
      </main>
    </div>
  );
};

export default App;
