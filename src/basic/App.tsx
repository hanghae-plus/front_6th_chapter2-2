import { NotificationBoundary } from "./features/notification/components/NotificationBoundary";

import { useState } from "react";

import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AdminPage, HomePage } from "@/basic/pages";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return (
    <NotificationBoundary>
      {!isAdmin ? (
        <HomePage
          setIsAdmin={setIsAdmin}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      ) : (
        <AdminPage
          setIsAdmin={setIsAdmin}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      )}
    </NotificationBoundary>
  );
};

export default App;
