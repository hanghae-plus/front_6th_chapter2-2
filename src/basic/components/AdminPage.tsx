// 관리자 페이지 컴포넌트
// 힌트:
// 1. 탭 UI로 상품 관리와 쿠폰 관리 분리
// 2. 상품 추가/수정/삭제 기능
// 3. 쿠폰 생성 기능
// 4. 할인 규칙 설정
//
// 필요한 hooks:
// - useProducts: 상품 CRUD
// - useCoupons: 쿠폰 CRUD
//
// 하위 컴포넌트:
// - ProductForm: 새 상품 추가 폼
// - ProductAccordion: 상품 정보 표시 및 수정
// - CouponForm: 새 쿠폰 추가 폼
// - CouponList: 쿠폰 목록 표시

import { useState } from "react";
import { Coupon } from "../../types";
import { AdminTab } from "./ui/AdminPage/AdminTab";
import { ProductTab } from "./ui/AdminPage/ProductTab";
import { CouponTab } from "./ui/AdminPage/CouponTab";

interface AdminPageProps {
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export function AdminPage({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <AdminTab
        tabs={[
          { label: "상품 관리", value: "products" },
          { label: "쿠폰 관리", value: "coupons" },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "products" ? (
        <ProductTab activeTab={activeTab} addNotification={addNotification} />
      ) : (
        <CouponTab
          addNotification={addNotification}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      )}
    </div>
  );
}
