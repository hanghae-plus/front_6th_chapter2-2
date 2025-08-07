// components
import ProductManagement from "../../components/admin/ProductManagement";
import CouponManagement from "../../components/admin/CouponManagement";
import { Tabs } from "../../components/ui/tabs";

// types
import type { NotificationType } from "../../types/admin";

import { ADMIN_TABS } from "../../constants/admin";
interface AdminPageProps {
  addNotification: (message: string, type: NotificationType) => void;
}

export default function AdminPage({ addNotification }: AdminPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <Tabs defaultValue={ADMIN_TABS.PRODUCTS}>
        <Tabs.List>
          <Tabs.Trigger value={ADMIN_TABS.PRODUCTS}>상품 관리</Tabs.Trigger>
          <Tabs.Trigger value={ADMIN_TABS.COUPONS}>쿠폰 관리</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content>
          <Tabs.Panel value={ADMIN_TABS.PRODUCTS}>
            <ProductManagement addNotification={addNotification} />
          </Tabs.Panel>

          <Tabs.Panel value={ADMIN_TABS.COUPONS}>
            <CouponManagement addNotification={addNotification} />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
