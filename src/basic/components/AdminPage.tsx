import { Coupon, ProductWithUI, ProductForm, CouponForm, Notification } from '../types';
import { AdminCouponManagement } from './admin/AdminCouponManagement';
import { AdminDashboardTabList } from './admin/AdminDashboardTabList';
import { AdminProductManagement } from './admin/AdminProductManagement';

interface AdminPageProps {
  activeTab: 'products' | 'coupons';
  setActiveTab: (tab: 'products' | 'coupons') => void;
  products: ProductWithUI[];
  coupons: Coupon[];
  getDisplayPrice: (price: number, productId?: string) => string;
  startEditProduct: (product: ProductWithUI | 'new') => void;
  deleteProduct: (id: string) => void;
  deleteCoupon: (code: string) => void;
  showProductForm: boolean;
  productForm: ProductForm;
  editingProduct: string | null;
  handleProductSubmit: (e: React.FormEvent) => void;
  updateProductForm: (updates: Partial<ProductForm>) => void;
  handleCancelProduct: () => void;
  addNotification: (message: string, type: Notification['type']) => void;
  showCouponForm: boolean;
  updateShowCouponForm: (show: boolean) => void;
  couponForm: CouponForm;
  handleCouponSubmit: (e: React.FormEvent) => void;
  updateCouponForm: (updates: Partial<CouponForm>) => void;
  handleAddProduct: () => void;
}

const AdminPage = ({
  activeTab,
  setActiveTab,
  products,
  coupons,
  getDisplayPrice,
  startEditProduct,
  deleteProduct,
  deleteCoupon,
  showProductForm,
  productForm,
  editingProduct,
  handleProductSubmit,
  updateProductForm,
  handleCancelProduct,
  addNotification,
  showCouponForm,
  updateShowCouponForm,
  couponForm,
  handleCouponSubmit,
  updateCouponForm,
  handleAddProduct,
}: AdminPageProps) => (
  <div className='max-w-6xl mx-auto'>
    <div className='mb-8'>
      <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
      <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
    </div>
    <AdminDashboardTabList activeTab={activeTab} setActiveTab={setActiveTab} />

    {activeTab === 'products' ? (
      <AdminProductManagement
        products={products}
        getDisplayPrice={getDisplayPrice}
        startEditProduct={startEditProduct}
        deleteProduct={deleteProduct}
        showProductForm={showProductForm}
        productForm={productForm}
        editingProduct={editingProduct}
        handleProductSubmit={handleProductSubmit}
        updateProductForm={updateProductForm}
        handleCancelProduct={handleCancelProduct}
        addNotification={addNotification}
        handleAddProduct={handleAddProduct}
      />
    ) : (
      <AdminCouponManagement
        coupons={coupons}
        deleteCoupon={deleteCoupon}
        showCouponForm={showCouponForm}
        updateShowCouponForm={updateShowCouponForm}
        couponForm={couponForm}
        handleCouponSubmit={handleCouponSubmit}
        updateCouponForm={updateCouponForm}
        addNotification={addNotification}
      />
    )}
  </div>
);

export { AdminPage };
