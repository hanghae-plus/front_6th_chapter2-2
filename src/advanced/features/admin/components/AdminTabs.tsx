import CouponAdmin from "@/advanced/features/admin/components/CouponAdmin";
import ProductAdmin from "@/advanced/features/admin/components/ProductAdmin";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import Tabs from "@/advanced/shared/components/ui/Tabs";

enum AdminTabsValue {
  PRODUCTS = "products",
  COUPONS = "coupons",
}

interface AdminTabsProps {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function AdminTabs({
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
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      </Tabs.Content>

      <Tabs.Content value={AdminTabsValue.COUPONS}>
        <CouponAdmin
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      </Tabs.Content>
    </Tabs>
  );
}
