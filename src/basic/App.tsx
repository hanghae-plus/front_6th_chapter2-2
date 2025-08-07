import { useState } from "react";

import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import NotificationItem from "@/basic/features/notification/components/NotificationItem";
import { useNotification } from "@/basic/features/notification/hooks/useNotification";
import { AdminPage, HomePage } from "@/basic/pages";

const App = () => {
  const { notifications, addNotification, removeNotification } =
    useNotification();

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              removeNotification={removeNotification}
            />
          ))}
        </div>
      )}

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
    </>
  );
};

export default App;
