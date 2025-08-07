import { useCallback } from "react";
import { Product } from "../types";
import { AdminPage } from "./components/AdminPage";
import { CartPage } from "./components/CartPage";
import { UIToast } from "./components/ui/UIToast";
import { Layout } from "./components/layout/Layout";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useAtom } from "jotai";
import { searchTermAtom, isAdminAtom, notificationsAtom } from "./atoms";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const App = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <Layout>
      <UIToast
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Layout.Header />
      <Layout.Main>
        {isAdmin ? (
          <AdminPage addNotification={addNotification} />
        ) : (
          <CartPage
            addNotification={addNotification}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </Layout.Main>
    </Layout>
  );
};

export default App;
