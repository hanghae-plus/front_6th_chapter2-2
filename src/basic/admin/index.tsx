import { useState } from 'react';
import {
  ActiveTab,
  ProductsActions,
  CouponActions,
  NotificationActions,
  ACTIVE_TAB_PRODUCTS,
} from '../shared/types';
import { Header } from './components/Header';
import { AdminProducts } from './pages/AdminProducts';
import { AdminCoupon } from './pages/AdminCoupon';

export const AdminPage = ({
  productsActions,
  couponActions,
  notificationActions,
}: {
  productsActions: ProductsActions;
  couponActions: CouponActions;
  notificationActions: NotificationActions;
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ACTIVE_TAB_PRODUCTS);

  return (
    <div className="max-w-6xl mx-auto">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === ACTIVE_TAB_PRODUCTS ? (
        <AdminProducts
          productsActions={productsActions}
          notificationActions={notificationActions}
        />
      ) : (
        <AdminCoupon
          couponActions={couponActions}
          notificationActions={notificationActions}
        />
      )}
    </div>
  );
};
