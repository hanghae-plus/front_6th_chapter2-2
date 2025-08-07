import { useState } from "react";

import { Provider } from "jotai";

import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import { NotificationBoundary } from "@/advanced/features/notification/components/NotificationBoundary";
import { AdminPage, HomePage } from "@/advanced/pages";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return (
    <Provider>
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
    </Provider>
  );
};

export default App;
