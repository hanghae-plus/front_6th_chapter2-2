import { useState } from "react";
import { Coupon } from "../types";
import ShopPage from "./____pages/shop/ShopPage";
import AdminPage from "./____pages/admin/AdminPage";
import NotificationProvider from "./___features/notification/NotificationProvider";
import { AdminContext } from "./____pages/admin-context";

const App = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NotificationProvider>
      <AdminContext value={{ isAdmin, setIsAdmin }}>
        {isAdmin ? (
          <AdminPage
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        ) : (
          <ShopPage
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        )}
      </AdminContext>
    </NotificationProvider>
  );
};

export default App;
