import { useState } from "react";
import { ProductWithUI, Coupon } from "../../../types";
import { TabNavigation } from "./TabNavigation";
import { ProductTab } from "./ProductTab";
import { CouponTab } from "./CouponTab";

interface AdminPageProps {
  // 상품 관련
  products: ProductWithUI[];
  onAddProduct: (product: Omit<ProductWithUI, "id">) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (productId: string) => void;
  getRemainingStock: (product: ProductWithUI) => number;

  // 쿠폰 관련
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (couponCode: string) => void;

  // 알림
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function AdminPage({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  getRemainingStock,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  addNotification,
}: AdminPageProps) {
  // =========== 탭 전환 관리 ===========
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );


  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <ProductTab
          products={products}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          getRemainingStock={getRemainingStock}
          addNotification={addNotification}
        />
      ) : (
        <CouponTab
          coupons={coupons}
          onAddCoupon={onAddCoupon}
          onDeleteCoupon={onDeleteCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}

export default AdminPage;
