import { ProductsTab } from "@widgets/admin/ui/ProductsTab";
import { CouponsTab } from "@widgets/admin/ui/CouponsTab";
import { useTabs, Tabs } from "@shared";

const enum AdminTab {
  PRODUCTS = "products",
  COUPONS = "coupons",
}

const adminTabConfig = {
  tabs: [
    {
      id: AdminTab.PRODUCTS,
      label: "상품 관리",
      content: <ProductsTab />,
    },
    {
      id: AdminTab.COUPONS,
      label: "쿠폰 관리",
      content: <CouponsTab />,
    },
  ],
  defaultTab: AdminTab.PRODUCTS,
};

export function AdminPage() {
  const { activeTab, setActiveTab, currentTab } = useTabs(adminTabConfig);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <Tabs
        tabs={adminTabConfig.tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-6"
      />

      {currentTab?.content}
    </div>
  );
}
