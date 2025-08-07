// hooks
import { Provider } from "jotai";
import { useAtomValue } from "jotai";

// utils
import { useProductSearch } from "./utils/hooks/useSearch";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage/ShopPage";

// stores
import { isAdminAtom } from "./stores/notificationStore";

const App = () => {
  const { searchTerm, setSearchTerm } = useProductSearch();
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <Provider>
      <div className="min-h-screen bg-gray-50">
        <Notification />
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <main className="max-w-7xl mx-auto px-4 py-8">
          {isAdmin ? <AdminPage /> : <ShopPage searchTerm={searchTerm} />}
        </main>
      </div>
    </Provider>
  );
};

export default App;
