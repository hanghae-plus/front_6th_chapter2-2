import { useState } from "react";
import { useProductForm } from "../entities/products/useProductForm";
import { useCouponForm } from "../entities/coupon/useCouponForm";
import {
  AdminTabs,
  ProductTable,
  ProductForm,
  CouponGrid,
  CouponForm,
} from "../components/ui/admin";

export const AdminPage = () => {
  // 내부 상태 관리
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  // Form 상태 확인을 위한 Hook들 (표시 여부 확인용)
  const productFormHook = useProductForm();
  const couponFormHook = useCouponForm();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <>
          <ProductTable />

          {productFormHook.showProductForm && <ProductForm />}
        </>
      ) : (
        <>
          <CouponGrid />

          {couponFormHook.showCouponForm && <CouponForm />}
        </>
      )}
    </div>
  );
};
