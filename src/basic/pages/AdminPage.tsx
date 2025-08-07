import { Dispatch, SetStateAction, useState } from "react";
import { Coupon } from "../../types";
import AdminNavigation from "../components/admin/AdminNavigation";
import CouponManager from "../components/admin/coupon/CouponManager";
import { TActiveTab } from "../constants/adminConstants";
import { NewProductForm, ProductWithUI } from "../types/product";
import ProductManager from "../components/admin/product/ProductManager";

interface AdminDashboardProps {
  // 상품 관련
  products: ProductWithUI[];
  addProduct: (product: NewProductForm) => void;
  updateProduct: (productId: string, product: NewProductForm) => void;
  clearProductForm: () => void;
  productForm: NewProductForm;
  editingProduct: string | null;
  showProductForm: boolean;
  setEditingProduct: Dispatch<SetStateAction<string | null>>;
  setProductForm: Dispatch<SetStateAction<NewProductForm>>;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
  editProductForm: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
  getRemainingStock: (product: ProductWithUI) => number;

  // 쿠폰 관련
  coupons: Coupon[];
  deleteCoupon: (couponId: string) => void;
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
}

const AdminPage = ({
  products,
  addProduct,
  updateProduct,
  clearProductForm,
  productForm,
  editingProduct,
  showProductForm,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  editProductForm,
  deleteProduct,
  getRemainingStock,
  coupons,
  deleteCoupon,
  addCoupon,
}: AdminDashboardProps) => {
  /** 탭 상태 */
  const [activeTab, setActiveTab] = useState<TActiveTab>("products");

  return (
    <div className="max-w-6xl mx-auto">
      {/* 관리자 대시보드 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      {/* 탭 네비게이션 */}
      <AdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 탭 컨텐츠 */}
      {activeTab === "products" ? (
        <ProductManager
          products={products}
          isAdmin={true}
          addProduct={addProduct}
          updateProduct={updateProduct}
          clearProductForm={clearProductForm}
          productForm={productForm}
          editingProduct={editingProduct}
          showProductForm={showProductForm}
          setEditingProduct={setEditingProduct}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          editProductForm={editProductForm}
          deleteProduct={deleteProduct}
          getRemainingStock={getRemainingStock}
        />
      ) : (
        <CouponManager coupons={coupons} deleteCoupon={deleteCoupon} addCoupon={addCoupon} />
      )}
    </div>
  );
};

export default AdminPage;
