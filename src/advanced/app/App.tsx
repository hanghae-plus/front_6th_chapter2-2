import { useState } from 'react';

import { NotificationList } from '../entities/notification';
import { useCouponService } from '../hooks/useCouponService';
import { AdminPage } from '../pages/admin';
import { CartPage } from '../pages/cart';

export const App = () => {
  const {
    coupons,
    selectedCoupon,
    onResetSelectedCoupon,
    onAddCoupon,
    onDeleteCoupon,
    onApplyCoupon,
  } = useCouponService();

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationList />

      {isAdmin ? (
        <AdminPage
          onChangeCartPage={() => setIsAdmin(false)}
          // coupons
          coupons={coupons}
          onAddCoupon={onAddCoupon}
          onDeleteCoupon={onDeleteCoupon}
        />
      ) : (
        <CartPage
          onChangeAdminPage={() => setIsAdmin(true)}
          // coupons
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onResetSelectedCoupon={onResetSelectedCoupon}
          onApplyCoupon={onApplyCoupon}
        />
      )}
    </div>
  );
};
