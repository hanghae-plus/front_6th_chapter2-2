import { useState } from "react";
import { ProductWithUI } from "../entities/products/product.types";
import { CouponWithUI } from "../entities/coupon/coupon.types";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { useProductForm } from "../entities/products/useProductForm";
import { useCouponForm } from "../entities/coupon/useCouponForm";
import { useAdminHandlers } from "../hooks/useAdminHandlers";
import { NotificationType } from "../types/common";
import {
  AdminTabs,
  ProductTable,
  ProductForm,
  CouponGrid,
  CouponForm,
} from "../components/ui/admin";

interface AdminPageProps {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  checkSoldOutByProductId: (productId: string) => boolean;

  addNotification: (message: string, type?: NotificationType) => void;
}

export const AdminPage = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  checkSoldOutByProductId,

  addNotification,
}: AdminPageProps) => {
  // Coupon 핸들러들을 내부에서 관리
  const { coupons, addCoupon, deleteCoupon } = useCouponHandlers({
    addNotification,
  });

  // 내부 상태 관리
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  // ProductForm 관련 로직을 내부로 이동
  const {
    productForm,
    editingProduct,
    showProductForm,
    setEditingProduct,
    setShowProductForm,
    updateField: updateProductField,
    startEditProduct,
    showNewProductForm,
  } = useProductForm();

  // CouponForm 관련 로직
  const {
    showCouponForm,
    couponForm,
    updateField: updateCouponField,
    closeCouponForm,
    openCouponForm,
  } = useCouponForm();

  // Admin 핸들러들
  const { handleProductSubmit, handleCouponSubmit } = useAdminHandlers({
    addProduct,
    updateProduct,
    addCoupon,
    addNotification,
    productForm,
    editingProduct,
    setEditingProduct,
    setShowProductForm,
    couponForm,
    closeCouponForm,
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <>
          <ProductTable
            products={products}
            checkSoldOutByProductId={checkSoldOutByProductId}
            onEditProduct={startEditProduct}
            onDeleteProduct={deleteProduct}
            onAddProduct={showNewProductForm}
          />

          {showProductForm && (
            <ProductForm
              productForm={productForm}
              editingProduct={editingProduct}
              onSubmit={handleProductSubmit}
              onCancel={() => setShowProductForm(false)}
              onUpdateField={updateProductField}
              addNotification={addNotification}
            />
          )}
        </>
      ) : (
        <>
          <CouponGrid
            coupons={coupons}
            onDeleteCoupon={deleteCoupon}
            onAddCoupon={openCouponForm}
          />

          {showCouponForm && (
            <CouponForm
              couponForm={couponForm}
              onSubmit={handleCouponSubmit}
              onCancel={closeCouponForm}
              onUpdateField={updateCouponField}
              addNotification={addNotification}
            />
          )}
        </>
      )}
    </div>
  );
};
