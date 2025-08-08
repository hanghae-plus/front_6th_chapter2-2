// hooks
import { Provider } from "jotai";
import { useAtomValue } from "jotai";

// hooks
import { useProductSearch } from "./hooks/useProductSearch";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage";

// stores
import { isAdminAtom } from "./stores/notificationStore";

const App = () => {
  return (
    <Provider>
      <Notification />
      <AppContent />
    </Provider>
  );
};

const AppContent = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  const { searchTerm, setSearchTerm } = useProductSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <ShopPage searchTerm={searchTerm} />}
      </main>
    </div>
  );
};

export default App;
