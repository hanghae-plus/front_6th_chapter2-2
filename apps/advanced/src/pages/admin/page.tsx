import { useState } from 'react';
import z from 'zod';
import CouponSection from './components/coupon';
import Header from './components/header';
import ProductSection from './components/product';
import { useAdminPresenter } from './presenter';

export const tabTypeSchema = z.enum(['PRODUCTS', 'COUPONS']);

const AdminPage = () => {
  const {
    coupons,
    products,
    productForm,
    updateProductForm,
    couponForm,
    updateCouponForm,
    formatPrice,
    handleProductSubmit,
    handleCouponSubmit,
    startEditProduct,
    removeCouponByCode,
    deleteProduct,
    showProductForm,
    setShowProductForm
  } = useAdminPresenter();

  const [activeTab, setActiveTab] = useState<z.infer<typeof tabTypeSchema>>(
    tabTypeSchema.enum.PRODUCTS
  );

  return (
    <main className='max-w-7xl mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === tabTypeSchema.enum.PRODUCTS && (
          <ProductSection
            products={products}
            productForm={productForm}
            onUpdateForm={updateProductForm}
            onSubmit={handleProductSubmit}
            onDelete={deleteProduct}
            formatPrice={formatPrice}
            startEditProduct={startEditProduct}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
          />
        )}

        {activeTab === tabTypeSchema.enum.COUPONS && (
          <CouponSection
            coupons={coupons}
            couponForm={couponForm}
            onUpdateForm={updateCouponForm}
            onSubmit={handleCouponSubmit}
            onDelete={removeCouponByCode}
          />
        )}
      </div>
    </main>
  );
};

export default AdminPage;
