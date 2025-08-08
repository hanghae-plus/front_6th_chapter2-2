import { useState } from "react";

import { AdminTabs, CouponManagementSection, ProductManagementSection } from "../components";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-1 text-gray-600">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? <ProductManagementSection /> : <CouponManagementSection />}
    </div>
  );
}
