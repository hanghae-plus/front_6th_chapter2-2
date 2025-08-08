import { useState, type ReactNode } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { AdminTabs, type AdminTab } from './AdminTabs';
import { CouponsTab } from './coupons-tab/CouponsTab';
import { ProductsTab } from './products-tab/ProductsTab';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const tabContent: Record<AdminTab, ReactNode> = {
    coupons: <CouponsTab />,
    products: <ProductsTab />,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <PageHeader
          title="관리자 대시보드"
          description="상품과 쿠폰을 관리할 수 있습니다"
        />
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
