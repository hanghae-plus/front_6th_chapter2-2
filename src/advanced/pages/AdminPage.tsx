import { useState } from "react";
import { Coupon, Product } from "../../types";
import ProductsTabContents from "../components/admin/ProductsTabContents";
import CouponsTabContents from "../components/admin/CouponsTabContents";

interface AdminPageProps {
  handleAddCoupon: (newCoupon: Coupon) => void;
  handleDeleteCoupon: (couponCode: string) => void;
  getRemainingStock: (product: Product) => number;
}

const AdminPage = ({
  handleAddCoupon,
  handleDeleteCoupon,
  getRemainingStock,
}: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  const handleClassName = (isActive: boolean) => {
    return `py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
      isActive
        ? "border-gray-900 text-gray-900"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={handleClassName(activeTab === "products")}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={handleClassName(activeTab === "coupons")}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <ProductsTabContents getRemainingStock={getRemainingStock} />
      ) : (
        <CouponsTabContents
          handleDeleteCoupon={handleDeleteCoupon}
          handleAddCoupon={handleAddCoupon}
        />
      )}
    </div>
  );
};

export default AdminPage;
