import { ProductWithUI } from "../../hooks/useProducts";
import ProductManagement from "../../components/admin/ProductManagement";
import CouponManagement from "../../components/admin/CouponManagement";
import { Tabs } from "../../components/ui/tabs";
import { ADMIN_TABS } from "../../types/admin";
import type { Coupon, CouponFormState, ProductFormState, NotificationType } from "../../types/admin";
import type { CartItem } from "../../../types";

interface AdminPageProps {
  // 상품 관련
  products: ProductWithUI[];
  cart: CartItem[];
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
  cart,
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
  return (
    <div className="max-w-6xl mx-auto">
      {/* 대시보드 헤더 */}
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
          </Tabs.Panel>

          <Tabs.Panel value={ADMIN_TABS.COUPONS}>
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
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
