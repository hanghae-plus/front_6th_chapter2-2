import { Provider, useAtom } from "jotai";
import { ToastList } from "./components/ui/ToastList";
import { AdminPage } from "./components/AdminPage";
import { ProductPage } from "./components/ProductPage";
import { CartPage } from "./components/CartPage";
import { Header } from "./components/Header";

import { isAdminAtom } from "./atoms";
import { useNotificationJotai } from "./hooks/useNotification";

const AppContent = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const notifications = useNotificationJotai();

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastList
        toasts={notifications.notifications}
        onClose={notifications.removeNotification}
      />

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductPage />
            <CartPage />
          </div>
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
