import React, { useState, useCallback } from 'react';

import type { Product } from '../../types';
import CouponManagement from '../components/admin/CouponManagement';
import ProductManagement from '../components/admin/ProductManagement';
import { useCoupons } from '../hooks/useCoupons';
import { useProducts } from '../hooks/useProducts';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

type TAdminPageProps = {
  getRemainingStock: (product: ProductWithUI) => number;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export function AdminPage(props: TAdminPageProps) {
  const { getRemainingStock, setNotifications } = props;

  const { coupons, addCoupon, removeCoupon } = useCoupons();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }

    return `${price.toLocaleString()}원`;
  };

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  const handleAddProduct = () => {
    setEditingProduct('new');
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId, () => {
      addNotification('상품이 삭제되었습니다.', 'success');
    });
  };

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setShowProductForm(false);
  };

  const handleDeleteCoupon = (couponCode: string) => {
    removeCoupon(couponCode, () => {
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm, () => {
        addNotification('상품이 수정되었습니다.', 'success');
      });
      setEditingProduct(null);
    } else {
      addProduct(
        {
          ...productForm,
          discounts: productForm.discounts,
        },
        () => {
          addNotification('상품이 추가되었습니다.', 'success');
        },
      );
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(
      couponForm,
      () => {
        addNotification('쿠폰이 추가되었습니다.', 'success');
      },
      () => {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      },
    );
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          showProductForm={showProductForm}
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          formatPrice={formatPrice}
          onAddProduct={handleAddProduct}
          onEditProduct={startEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onSubmitProduct={handleProductSubmit}
          onCancelProduct={handleCancelProduct}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          showCouponForm={showCouponForm}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          onAddCoupon={() => setShowCouponForm(!showCouponForm)}
          onDeleteCoupon={handleDeleteCoupon}
          onSubmitCoupon={handleCouponSubmit}
          onCancelCoupon={() => setShowCouponForm(false)}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}
