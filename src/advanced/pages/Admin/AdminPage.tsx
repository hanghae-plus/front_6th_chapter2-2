// components
import { Tabs } from "../../components/ui/tabs";

// features
import ProductManagementFeature from "./features/ProductManagementFeature";
import CouponManagementFeature from "./features/CouponManagementFeature";
import InventoryManagementFeature from "./features/InventoryManagementFeature";

// types
import { ADMIN_TABS } from "../../constants/admin";

// 관리 기능들을 동적으로 등록할 수 있는 구조
interface AdminFeature {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

// 관리 기능들을 여기에 등록
const adminFeatures: AdminFeature[] = [
  {
    id: ADMIN_TABS.PRODUCTS,
    label: "상품 관리",
    component: ProductManagementFeature,
  },
  {
    id: ADMIN_TABS.COUPONS,
    label: "쿠폰 관리",
    component: CouponManagementFeature,
  },
  {
    id: ADMIN_TABS.INVENTORY,
    label: "재고 관리",
    component: InventoryManagementFeature,
  },
];

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">다양한 관리 기능을 제공합니다</p>
      </div>

      <Tabs defaultValue={adminFeatures[0]?.id || ADMIN_TABS.PRODUCTS}>
        <Tabs.List>
          {adminFeatures.map((feature) => (
            <Tabs.Trigger key={feature.id} value={feature.id}>
              {feature.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content>
          {adminFeatures.map((feature) => {
            const FeatureComponent = feature.component;
            return (
              <Tabs.Panel key={feature.id} value={feature.id}>
                <FeatureComponent />
              </Tabs.Panel>
            );
          })}
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
