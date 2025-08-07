// components
import ProductManagement from "../../components/admin/ProductManagement";
import CouponManagement from "../../components/admin/CouponManagement";
import { Tabs } from "../../components/ui/tabs";

// hooks
import { useProductForm } from "../../hooks/useProductForm";
import { useCouponForm } from "../../hooks/useCouponForm";
import { useAtomValue } from "jotai";
import { productsAtom } from "../../stores/productStore";
import { cartAtom } from "../../stores/cartStore";
import { couponsAtom } from "../../stores/couponStore";

// types
import type { NotificationType } from "../../types/admin";

import { ADMIN_TABS } from "../../constants/admin";

interface AdminPageProps {
  // 상품 관련
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (product: Omit<Product, "id">) => void;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => void;
  addNotification: (message: string, type: NotificationType) => void;

  // 쿠폰 관련
  onDeleteCoupon: (couponCode: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
}

export default function AdminPage({
  // 상품 관련 props
  onDeleteProduct,
  onAddProduct,
  onUpdateProduct,
  addNotification,

  // 쿠폰 관련 props
  onDeleteCoupon,
  onAddCoupon,
}: AdminPageProps) {
  // Jotai atom에서 직접 값 가져오기
  const products = useAtomValue(productsAtom);
  const cart = useAtomValue(cartAtom);
  const coupons = useAtomValue(couponsAtom);

  const {
    editingProduct,
    productForm,
    showProductForm,
    updateField: updateProductField,
    startEditProduct,
    startAddProduct,
    cancelProductForm,
    handleProductSubmit,
  } = useProductForm();

  // Coupon Form 훅 사용
  const { couponForm, showCouponForm, updateField, showForm, hideForm, handleCouponSubmit } = useCouponForm();

  // Product Form 제출 처리
  const handleProductFormSubmit = (e: React.FormEvent) => {
    handleProductSubmit(e, onAddProduct, onUpdateProduct);
  };

  // Coupon Form 제출 처리
  const handleCouponFormSubmit = (e: React.FormEvent) => {
    handleCouponSubmit(e, onAddCoupon);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <Tabs defaultValue={ADMIN_TABS.PRODUCTS}>
        <Tabs.List>
          <Tabs.Trigger value={ADMIN_TABS.PRODUCTS}>상품 관리</Tabs.Trigger>
          <Tabs.Trigger value={ADMIN_TABS.COUPONS}>쿠폰 관리</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content>
          <Tabs.Panel value={ADMIN_TABS.PRODUCTS}>
            <ProductManagement
              products={products}
              cart={cart}
              onEditProduct={startEditProduct}
              onDeleteProduct={onDeleteProduct}
              onAddProduct={startAddProduct}
              showProductForm={showProductForm}
              productForm={productForm}
              updateField={updateProductField}
              editingProduct={editingProduct}
              onProductSubmit={handleProductFormSubmit}
              onCancelProductForm={cancelProductForm}
              addNotification={addNotification}
            />
          </Tabs.Panel>

          <Tabs.Panel value={ADMIN_TABS.COUPONS}>
            <CouponManagement
              coupons={coupons}
              onDeleteCoupon={onDeleteCoupon}
              showCouponForm={showCouponForm}
              showForm={showForm}
              hideForm={hideForm}
              couponForm={couponForm}
              updateField={updateField}
              onCouponSubmit={handleCouponFormSubmit}
              addNotification={addNotification}
            />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
