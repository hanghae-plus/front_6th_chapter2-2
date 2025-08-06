import { useState } from "react";
import { ProductWithUI } from "../entities/products/product.types";
import { CouponWithUI } from "../entities/coupon/coupon.types";
import { useProductHandlers } from "../entities/products/useProductHandlers";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { useProductForm } from "../entities/products/useProductForm";
import { useCouponForm } from "../entities/coupon/useCouponForm";
import { useAdminHandlers } from "../hooks/useAdminHandlers";
import { useNotifications } from "../hooks/useNotifications";
import { useProductUtils } from "../entities/products/useProductUtils";
import {
  AdminTabs,
  ProductTable,
  ProductForm,
  CouponGrid,
  CouponForm,
} from "../components/ui/admin";

export const AdminPage = () => {
  // Hooks를 직접 사용
  const { addNotification } = useNotifications();
  const productHandlers = useProductHandlers({ addNotification });
  const couponHandlers = useCouponHandlers({ addNotification });

  // cart는 AdminPage에서 필요하지 않으므로 빈 배열로 전달
  const productUtils = useProductUtils({
    products: productHandlers.state.items,
    cart: [],
  });

  // 내부 상태 관리
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  // Form 관련 Hook들
  const productFormHook = useProductForm();
  const couponFormHook = useCouponForm();

  // Admin 핸들러들 (네임스페이스 구조 활용)
  const adminHandlers = useAdminHandlers({
    productActions: {
      add: productHandlers.actions.add,
      update: productHandlers.actions.update,
    },
    couponActions: {
      add: couponHandlers.actions.add,
    },
    addNotification,
    productForm: productFormHook.productForm,
    editingProduct: productFormHook.editingProduct,
    setEditingProduct: productFormHook.setEditingProduct,
    setShowProductForm: productFormHook.setShowProductForm,
    couponForm: couponFormHook.couponForm,
    closeCouponForm: couponFormHook.closeCouponForm,
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
            onEditProduct={productFormHook.startEditProduct}
            onAddProduct={productFormHook.showNewProductForm}
          />

          {productFormHook.showProductForm && (
            <ProductForm
              productForm={productFormHook.productForm}
              editingProduct={productFormHook.editingProduct}
              onSubmit={adminHandlers.actions.handleProductSubmit}
              onCancel={() => productFormHook.setShowProductForm(false)}
              onUpdateField={productFormHook.updateField}
            />
          )}
        </>
      ) : (
        <>
          <CouponGrid onAddCoupon={couponFormHook.openCouponForm} />

          {couponFormHook.showCouponForm && (
            <CouponForm
              couponForm={couponFormHook.couponForm}
              onSubmit={adminHandlers.actions.handleCouponSubmit}
              onCancel={couponFormHook.closeCouponForm}
              onUpdateField={couponFormHook.updateField}
            />
          )}
        </>
      )}
    </div>
  );
};
