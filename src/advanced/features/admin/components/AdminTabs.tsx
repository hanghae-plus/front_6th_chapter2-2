import CouponAdmin from "@/advanced/features/admin/components/CouponAdmin";
import ProductAdmin from "@/advanced/features/admin/components/ProductAdmin";
import Tabs from "@/advanced/shared/components/ui/Tabs";

enum AdminTabsValue {
  PRODUCTS = "products",
  COUPONS = "coupons",
}

export default function AdminTabs() {
  return (
    <Tabs initialValue={AdminTabsValue.PRODUCTS}>
      <Tabs.List>
        <Tabs.Trigger value={AdminTabsValue.PRODUCTS}>상품 관리</Tabs.Trigger>
        <Tabs.Trigger value={AdminTabsValue.COUPONS}>쿠폰 관리</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value={AdminTabsValue.PRODUCTS}>
        <ProductAdmin />
      </Tabs.Content>

      <Tabs.Content value={AdminTabsValue.COUPONS}>
        <CouponAdmin />
      </Tabs.Content>
    </Tabs>
  );
}
