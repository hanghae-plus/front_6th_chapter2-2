// components
import ProductManagement from "../../components/admin/ProductManagement";
import CouponManagement from "../../components/admin/CouponManagement";
import { Tabs } from "../../components/ui/tabs";

// hooks
import { useProductForm } from "../../hooks/useProductForm";
import { useCouponForm } from "../../hooks/useCouponForm";
import { useAtomValue, useSetAtom } from "jotai";
import { productsAtom, addProductAtom, updateProductAtom, deleteProductAtom } from "../../stores/productStore";
import { cartAtom } from "../../stores/cartStore";
import { couponsAtom, addCouponAtom, deleteCouponAtom } from "../../stores/couponStore";
import { addNotificationAtom } from "../../stores/notificationStore";

// utils
import { withTryNotifySuccess } from "../../utils/withNotify";

// types
import type { Coupon } from "../../types/admin";
import { ADMIN_TABS } from "../../constants/admin";
import { Product } from "../../../types";

export default function AdminPage() {
  // Jotai atom에서 직접 값 가져오기
  const products = useAtomValue(productsAtom);
  const cart = useAtomValue(cartAtom);
  const coupons = useAtomValue(couponsAtom);

  // Jotai setter 함수들
  const addProductSet = useSetAtom(addProductAtom);
  const updateProductSet = useSetAtom(updateProductAtom);
  const deleteProductSet = useSetAtom(deleteProductAtom);
  const addCouponSet = useSetAtom(addCouponAtom);
  const deleteCouponSet = useSetAtom(deleteCouponAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);

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

  // 이벤트 핸들러들 (withTryNotifySuccess 적용)
  const handleDeleteProduct = withTryNotifySuccess(
    (productId: string) => deleteProductSet(productId),
    "상품이 삭제되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleAddProduct = withTryNotifySuccess(
    (product: Omit<Product, "id">) => addProductSet(product),
    "상품이 추가되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleUpdateProduct = withTryNotifySuccess(
    (productId: string, updates: Partial<Product>) => updateProductSet({ productId, updates }),
    "상품이 수정되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleDeleteCoupon = withTryNotifySuccess(
    (couponCode: string) => deleteCouponSet(couponCode),
    "쿠폰이 삭제되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  const handleAddCoupon = withTryNotifySuccess(
    (coupon: Coupon) => addCouponSet(coupon),
    "쿠폰이 추가되었습니다.",
    (message, type) => addNotificationSet({ message, type })
  );

  // Product Form 제출 처리
  const handleProductFormSubmit = (e: React.FormEvent) => {
    handleProductSubmit(e, handleAddProduct, handleUpdateProduct);
  };

  // Coupon Form 제출 처리
  const handleCouponFormSubmit = (e: React.FormEvent) => {
    handleCouponSubmit(e, handleAddCoupon);
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
              onDeleteProduct={handleDeleteProduct}
              onAddProduct={startAddProduct}
              showProductForm={showProductForm}
              productForm={productForm}
              updateField={updateProductField}
              editingProduct={editingProduct}
              onProductSubmit={handleProductFormSubmit}
              onCancelProductForm={cancelProductForm}
              addNotification={(message, type) => addNotificationSet({ message, type })}
            />
          </Tabs.Panel>

          <Tabs.Panel value={ADMIN_TABS.COUPONS}>
            <CouponManagement
              coupons={coupons}
              onDeleteCoupon={handleDeleteCoupon}
              showCouponForm={showCouponForm}
              showForm={showForm}
              hideForm={hideForm}
              couponForm={couponForm}
              updateField={updateField}
              onCouponSubmit={handleCouponFormSubmit}
              addNotification={(message, type) => addNotificationSet({ message, type })}
            />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
