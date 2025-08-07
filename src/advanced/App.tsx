import { Provider } from "jotai";
import Header from "./components/layout/Header";
import { NotificationProvider } from "./hooks/useNotification";
import AdminPage from "./pages/AdminPage";
import { CustomerPage } from "./pages/CustomerPage";
import { useAtom } from "jotai";
import { isAdminAtom } from "./atoms/adminAtoms";

const AppContent = () => {
  /** 관리자 상태 여부 */
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">{isAdmin ? <AdminPage /> : <CustomerPage />}</main>
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Provider>
  );
};

export default App;
