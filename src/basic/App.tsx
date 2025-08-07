import { useState, useCallback } from "react";
import { Coupon, Product } from "../types";
import { AdminPage } from "./components/AdminPage";
import { CartPage } from "./components/CartPage";
import { UIToast } from "./components/ui/UIToast";
import { Layout } from "./components/layout/Layout";
import { useDebounce } from "./utils/hooks/useDebounce";

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
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItemCount, setTotalItemCount] = useState(0);
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
      <Layout.Header
        isAdmin={isAdmin}
        searchTerm={debouncedSearchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        totalItemCount={totalItemCount}
      />
      <Layout.Main>
        {isAdmin ? (
          <AdminPage
            addNotification={addNotification}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        ) : (
          <CartPage
            addNotification={addNotification}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            setTotalItemCount={setTotalItemCount}
          />
        )}
      </Layout.Main>
    </Layout>
  );
};

export default App;
