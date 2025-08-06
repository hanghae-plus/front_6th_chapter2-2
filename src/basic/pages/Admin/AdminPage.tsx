import { useState } from "react";
import { ProductWithUI } from "../../hooks/useProducts";
import ProductManagement from "../../components/admin/ProductManagement";
import CouponManagement from "../../components/admin/CouponManagement";
import { ADMIN_TABS } from "../../types/admin";
import type { AdminTab, Coupon, CouponFormState, ProductFormState, NotificationType } from "../../types/admin";

interface AdminPageProps {
  // 상품 관련
  products: ProductWithUI[];
  formatPriceWithAdmin: (price: number, productId?: string) => string;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
  showProductForm: boolean;
  productForm: ProductFormState;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormState>>;
  editingProduct: string | null;
  onProductSubmit: (e: React.FormEvent) => void;
  onCancelProductForm: () => void;
  addNotification: (message: string, type: NotificationType) => void;

  // 쿠폰 관련
  coupons: Coupon[];
  onDeleteCoupon: (couponCode: string) => void;
  showCouponForm: boolean;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
  couponForm: CouponFormState;
  setCouponForm: React.Dispatch<React.SetStateAction<CouponFormState>>;
  onCouponSubmit: (e: React.FormEvent) => void;
}

export default function AdminPage({
  // 상품 관련 props
  products,
  formatPriceWithAdmin,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  showProductForm,
  productForm,
  setProductForm,
  editingProduct,
  onProductSubmit,
  onCancelProductForm,
  addNotification,

  // 쿠폰 관련 props
  coupons,
  onDeleteCoupon,
  showCouponForm,
  setShowCouponForm,
  couponForm,
  setCouponForm,
  onCouponSubmit,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(ADMIN_TABS.PRODUCTS);

  return (
    <div className="max-w-6xl mx-auto">
      {/* 대시보드 헤더 */}
      <AdminDashboardHeader title="관리자 대시보드" description="상품과 쿠폰을 관리할 수 있습니다" />

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab(ADMIN_TABS.PRODUCTS)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === ADMIN_TABS.PRODUCTS
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab(ADMIN_TABS.COUPONS)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === ADMIN_TABS.COUPONS
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === ADMIN_TABS.PRODUCTS ? (
        <ProductManagement
          products={products}
          formatPriceWithAdmin={formatPriceWithAdmin}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          onAddProduct={onAddProduct}
          showProductForm={showProductForm}
          productForm={productForm}
          setProductForm={setProductForm}
          editingProduct={editingProduct}
          onProductSubmit={onProductSubmit}
          onCancelProductForm={onCancelProductForm}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          onDeleteCoupon={onDeleteCoupon}
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          onCouponSubmit={onCouponSubmit}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}

const AdminDashboardHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
};
