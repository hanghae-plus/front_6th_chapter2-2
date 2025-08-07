import { useState } from "react";
import { Coupon } from "../types";
import ShopPage from "./____pages/shop/ShopPage";
import AdminPage from "./____pages/admin/AdminPage";
import NotificationProvider from "./___features/notification/NotificationProvider";

const App = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NotificationProvider>
      {isAdmin ? (
        <AdminPage
          setIsAdmin={setIsAdmin}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      ) : (
        <ShopPage
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          setIsAdmin={setIsAdmin}
        />
      )}
    </NotificationProvider>
  );
};

export default App;
