import CouponAdmin from "@/basic/features/admin/components/CouponAdmin";
import ProductAdmin from "@/basic/features/admin/components/ProductAdmin";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import Tabs from "@/basic/shared/components/ui/Tabs";

enum AdminTabsValue {
  PRODUCTS = "products",
  COUPONS = "coupons",
}

interface AdminTabsProps {
  addNotification: AddNotification;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function AdminTabs({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: AdminTabsProps) {
  return (
    <Tabs initialValue={AdminTabsValue.PRODUCTS}>
      <Tabs.List>
        <Tabs.Trigger value={AdminTabsValue.PRODUCTS}>상품 관리</Tabs.Trigger>
        <Tabs.Trigger value={AdminTabsValue.COUPONS}>쿠폰 관리</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value={AdminTabsValue.PRODUCTS}>
        <ProductAdmin
          addNotification={addNotification}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      </Tabs.Content>

      <Tabs.Content value={AdminTabsValue.COUPONS}>
        <CouponAdmin
          addNotification={addNotification}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      </Tabs.Content>
    </Tabs>
  );
}
