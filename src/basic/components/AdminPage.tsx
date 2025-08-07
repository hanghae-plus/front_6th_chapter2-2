// 관리자 페이지 메인 컴포넌트 (리팩토링 완료)
import { useState } from "react";
import { ProductManagement } from "./admin/ProductManagement";
import { CouponManagement } from "./admin/CouponManagement";
import { Coupon, CartItem, ProductWithUI } from "../type/types";

interface AdminPageProps {
  isAdmin: boolean;
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  removeProduct: (productId: string) => void;
  coupons: Coupon[];
  addCoupon: (newCoupon: Omit<Coupon, "id">) => void;
  removeCoupon: (couponCode: string) => void;
  cart: CartItem[];
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

/**
 * 관리자 페이지 컴포넌트
 *
 * 주요 기능:
 * 1. 탭 UI로 상품 관리와 쿠폰 관리 분리
 * 2. 각 섹션별로 컴포넌트 분리하여 관심사 분리
 * 3. 깔끔한 코드 구조와 재사용성 향상
 *
 * 리팩토링 완료:
 * - 665줄 → 80줄로 대폭 감소
 * - 기능별 컴포넌트 분리
 * - 타입 안정성 향상
 */
export function AdminPage({
  isAdmin,
  products,
  addProduct,
  updateProduct,
  removeProduct,
  coupons,
  addCoupon,
  removeCoupon,
  cart,
  addNotification,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "products" ? (
        <ProductManagement
          isAdmin={isAdmin}
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          removeProduct={removeProduct}
          cart={cart}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          addCoupon={addCoupon}
          removeCoupon={removeCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}
