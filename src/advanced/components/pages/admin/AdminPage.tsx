import React from 'react';
import { useAtom } from 'jotai';
import { activeTabAtom } from '../../../atoms/uiAtoms';
import { AdminHeader } from './AdminHeader';
import { ProductManagement } from './ProductManagement';
import { CouponManagement } from './CouponManagement';
import { ProductWithUI } from '../../../types';

interface AdminPageProps {
  onSetActiveTab: (tab: 'products' | 'coupons') => void;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (productId: string, updates: any) => void;
  onDeleteProduct: (productId: string) => void;
  onStartEditProduct: (product: ProductWithUI) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onStartEditProduct,
}) => {
  const [activeTab] = useAtom(activeTabAtom);

  return (
    <div className='max-w-6xl mx-auto'>
      <AdminHeader />

      {activeTab === 'products' ? (
        <ProductManagement
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          onStartEditProduct={onStartEditProduct}
        />
      ) : (
        <CouponManagement />
      )}
    </div>
  );
};
