import React from 'react';
import { ProductWithUI } from '../../../types';
import { AdminHeader } from './AdminHeader';
import { ProductManagement } from './ProductManagement';
import { CouponManagement } from './CouponManagement';

interface AdminPageProps {
  activeTab: 'products' | 'coupons';
  products: ProductWithUI[];
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  editingProduct: string | null;
  showProductForm: boolean;
  cart: any[];
  isAdmin: boolean;
  coupons: any[];
  couponForm: {
    name: string;
    code: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
  };
  showCouponForm: boolean;
  onSetActiveTab: (tab: 'products' | 'coupons') => void;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (productId: string, updates: any) => void;
  onDeleteProduct: (productId: string) => void;
  onStartEditProduct: (product: ProductWithUI) => void;
  setProductForm: (form: any) => void;
  setEditingProduct: (productId: string | null) => void;
  setShowProductForm: (show: boolean) => void;
  onRemoveCoupon: (code: string) => void;
  onAddCoupon: (coupon: any) => void;
  setCouponForm: (form: any) => void;
  setShowCouponForm: (show: boolean) => void;
  addNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  activeTab,
  products,
  productForm,
  editingProduct,
  showProductForm,
  cart,
  isAdmin,
  coupons,
  couponForm,
  showCouponForm,
  onSetActiveTab,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onStartEditProduct,
  setProductForm,
  setEditingProduct,
  setShowProductForm,
  onRemoveCoupon,
  onAddCoupon,
  setCouponForm,
  setShowCouponForm,
  addNotification,
}) => {
  return (
    <div className='max-w-6xl mx-auto'>
      <AdminHeader activeTab={activeTab} onSetActiveTab={onSetActiveTab} />

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          productForm={productForm}
          editingProduct={editingProduct}
          showProductForm={showProductForm}
          cart={cart}
          isAdmin={isAdmin}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          onStartEditProduct={onStartEditProduct}
          setProductForm={setProductForm}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          couponForm={couponForm}
          showCouponForm={showCouponForm}
          onRemoveCoupon={onRemoveCoupon}
          onAddCoupon={onAddCoupon}
          setCouponForm={setCouponForm}
          setShowCouponForm={setShowCouponForm}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};
