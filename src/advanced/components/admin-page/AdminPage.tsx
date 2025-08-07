import { useState, type ReactNode } from 'react';
import { AdminTabs, type AdminTab } from './AdminTabs';
import { CouponsTab } from './coupons-tab/CouponsTab';
import { ProductsTab } from './products-tab/ProductsTab';
import { PageInfo } from './ui/PageInfo';
import { PageTitle } from './ui/PageTItle';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const tabContent: Record<AdminTab, ReactNode> = {
    coupons: <CouponsTab />,
    products: <ProductsTab />,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <PageTitle />
        <PageInfo />
      </div>

      <AdminTabs
        activeTab={activeTab}
        onClickTab={({ id }) => {
          setActiveTab(id);
        }}
      />

      {tabContent[activeTab]}
    </div>
  );
}
