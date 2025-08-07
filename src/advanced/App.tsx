import { CartPage } from "./components/CartPage";
import { Header } from "./components/Header";
import { NotificationList } from "./components/NotificationList";
import { AdminPage } from "./components/AdminPage";
import { useAtomValue } from "jotai";
import { isAdminAtom } from "./stores";

const App = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};

export default App;
