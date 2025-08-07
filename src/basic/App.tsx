import { NotificationBoundary } from "./features/notification/components/NotificationBoundary";

import { useState } from "react";

import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { useNotification } from "@/basic/features/notification/hooks/useNotification";
import { AdminPage, HomePage } from "@/basic/pages";

const App = () => {
  const { notifications, addNotification, removeNotification } =
    useNotification();

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return (
    <NotificationBoundary>
      {!isAdmin ? (
        <HomePage
          setIsAdmin={setIsAdmin}
          addNotification={addNotification}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      ) : (
        <AdminPage
          setIsAdmin={setIsAdmin}
          addNotification={addNotification}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      )}
    </NotificationBoundary>
  );
};

export default App;
