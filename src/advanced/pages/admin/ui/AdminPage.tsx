import { useState } from 'react';

import type { Coupon } from '../../../../types';
import { CouponTab } from '../../../components/ui/CouponTab';
import { ProductTab } from '../../../components/ui/ProductTab';
import { TabNavigation } from '../../../components/ui/TabNavigation';
import type { ProductWithUI } from '../../../constants';
import type { NotificationVariant } from '../../../entities/notification';
import { AdminHeader } from '../../../widgets/admin-header';

interface AdminPageProps {
  onChangeCartPage: () => void;

  products: ProductWithUI[];
  onAddProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (productId: string) => void;

  coupons: Coupon[];
  onAddCoupon: (newCoupon: Coupon) => void;
  onDeleteCoupon: (couponCode: string) => void;

  onAddNotification: (message: string, type: NotificationVariant) => void;
}

export function AdminPage({
  onChangeCartPage,

  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,

  coupons,
  onAddCoupon,
  onDeleteCoupon,

  onAddNotification,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  return (
    <>
      <AdminHeader onBackShop={onChangeCartPage} />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
            <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
          </div>
          <TabNavigation
            activeTab={activeTab}
            handleClickProductTab={() => setActiveTab('products')}
            handleClickCouponTab={() => setActiveTab('coupons')}
          />

          {(() => {
            if (activeTab === 'products') {
              return (
                <ProductTab
                  products={products}
                  onAddProduct={onAddProduct}
                  onUpdateProduct={onUpdateProduct}
                  onDeleteProduct={onDeleteProduct}
                  onAddNotification={onAddNotification}
                />
              );
            }

            return (
              <CouponTab
                coupons={coupons}
                onAddCoupon={onAddCoupon}
                onDeleteCoupon={onDeleteCoupon}
                onAddNotification={onAddNotification}
              />
            );
          })()}
        </div>
      </main>
    </>
  );
}
