import { useState } from 'react';
import { ActiveTab, ACTIVE_TAB_PRODUCTS } from '../shared/types';
import { Title } from './components/Title';
import { AdminProducts } from './pages/AdminProducts';
import { AdminCoupon } from './pages/AdminCoupon';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ACTIVE_TAB_PRODUCTS);

  return (
    <div className="max-w-6xl mx-auto">
      <Title activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === ACTIVE_TAB_PRODUCTS ? <AdminProducts /> : <AdminCoupon />}
    </div>
  );
};
