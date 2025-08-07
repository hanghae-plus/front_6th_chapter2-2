import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { couponsAtom, deleteCouponAtom, addCouponAtom } from '../atoms/couponAtoms';
import {
  productFormAtom,
  showProductFormAtom,
  editingProductAtom,
  couponFormAtom,
  showCouponFormAtom,
  handleProductFormSubmitAtom,
  startEditProductAtom,
  handleCancelProductAtom,
  updateProductFormAtom,
  updateShowProductFormAtom,
  resetEditingProductAtom,
  handleCouponFormSubmitAtom,
  updateCouponFormAtom,
  updateShowCouponFormAtom,
} from '../atoms/formAtoms';
import { addNotificationAtom } from '../atoms/notificationAtoms';
import {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom,
} from '../atoms/productAtoms';
import { activeTabAtom } from '../atoms/uiAtoms';
import { formatPrice } from '../utils/formatters';
import { AdminCouponManagement } from './admin/AdminCouponManagement';
import { AdminDashboardTabList } from './admin/AdminDashboardTabList';
import { AdminProductManagement } from './admin/AdminProductManagement';

const AdminPage = () => {
  // atoms 직접 사용
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const products = useAtomValue(productsAtom);
  const coupons = useAtomValue(couponsAtom);
  const productForm = useAtomValue(productFormAtom);
  const showProductForm = useAtomValue(showProductFormAtom);
  const editingProduct = useAtomValue(editingProductAtom);
  const couponForm = useAtomValue(couponFormAtom);
  const showCouponForm = useAtomValue(showCouponFormAtom);

  // action atoms
  const handleProductFormSubmitAction = useSetAtom(handleProductFormSubmitAtom);
  const startEditProductAction = useSetAtom(startEditProductAtom);
  const handleCancelProductAction = useSetAtom(handleCancelProductAtom);
  const updateProductFormAction = useSetAtom(updateProductFormAtom);
  const updateShowProductFormAction = useSetAtom(updateShowProductFormAtom);
  const resetEditingProductAction = useSetAtom(resetEditingProductAtom);
  const updateProductAction = useSetAtom(updateProductAtom);
  const addProductAction = useSetAtom(addProductAtom);
  const deleteProductAction = useSetAtom(deleteProductAtom);
  const deleteCouponAction = useSetAtom(deleteCouponAtom);
  const addCouponAction = useSetAtom(addCouponAtom);
  const addNotificationAction = useSetAtom(addNotificationAtom);
  const handleCouponFormSubmitAction = useSetAtom(handleCouponFormSubmitAtom);
  const updateCouponFormAction = useSetAtom(updateCouponFormAtom);
  const updateShowCouponFormAction = useSetAtom(updateShowCouponFormAtom);

  // wrapper 함수들
  const getDisplayPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && product.stock <= 0) {
        return 'SOLD OUT';
      }
    }
    return formatPrice(price, true); // 관리자 모드에서는 항상 true
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProductAction({ id: editingProduct, productForm });
    } else {
      addProductAction({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    handleProductFormSubmitAction();
    resetEditingProductAction();
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCouponAction(couponForm);
    handleCouponFormSubmitAction();
  };

  const handleAddProduct = () => {
    startEditProductAction('new');
    updateProductFormAction({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    updateShowProductFormAction(true);
  };

  const addNotification = (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    addNotificationAction({ id, message, type });
  };

  return (
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
          startEditProduct={startEditProductAction}
          deleteProduct={deleteProductAction}
          showProductForm={showProductForm}
          productForm={productForm}
          editingProduct={editingProduct}
          handleProductSubmit={handleProductSubmit}
          updateProductForm={updateProductFormAction}
          handleCancelProduct={handleCancelProductAction}
          addNotification={addNotification}
          handleAddProduct={handleAddProduct}
        />
      ) : (
        <AdminCouponManagement
          coupons={coupons}
          deleteCoupon={deleteCouponAction}
          showCouponForm={showCouponForm}
          updateShowCouponForm={updateShowCouponFormAction}
          couponForm={couponForm}
          handleCouponSubmit={handleCouponSubmit}
          updateCouponForm={updateCouponFormAction}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export { AdminPage };
