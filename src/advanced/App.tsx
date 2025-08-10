import { Product } from "../types";
import { Provider } from "jotai";
import NotificationToast from "./components/ui/NotificationToast";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import Header from "./layout/Header";
import { useAtom } from "jotai";
import { isAdminAtom } from "./atoms";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const AppContent = () => {
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
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
