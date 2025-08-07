import { useState } from "react";
import { ICoupon, IProductWithUI } from "../type";
import AdminTabs from "../components/AdminTabs";
import ProductTab from "../components/product/ProductTab";
import CouponTab from "../components/coupon/CouponTab";

interface AdminPageProps {
  // products
  products: IProductWithUI[];
  addProduct: (newProduct: Omit<IProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<IProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  getRemainingStock: (product: IProductWithUI) => number;

  // coupons
  coupons: ICoupon[];
  addCoupon: (newCoupon: ICoupon) => void;
  deleteCoupon: (couponCode: string) => void;
  selectedCoupon: ICoupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<ICoupon | null>>;

  // notification
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const AdminPage = ({
  products,
  getRemainingStock,
  coupons,
  addNotification,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  deleteCoupon,
  selectedCoupon,
  setSelectedCoupon,
}: AdminPageProps) => {
  // 관리자 페이지 - 활성화된 탭 (상품/쿠폰 관리)
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  const handleActiveTab = (value: "products" | "coupons") => {
    setActiveTab(value);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        {/* 탭 활성화 네비게이션 */}
        <AdminTabs activeTab={activeTab} handleActiveTab={handleActiveTab} />
      </div>

      {activeTab === "products" ? (
        // Product Tab
        <ProductTab
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          getRemainingStock={getRemainingStock}
          addNotification={addNotification}
        />
      ) : (
        // Coupon Tab
        <CouponTab
          coupons={coupons}
          addCoupon={addCoupon}
          deleteCoupon={deleteCoupon}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default AdminPage;
