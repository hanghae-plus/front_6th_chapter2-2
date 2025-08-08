import { useState, useCallback } from 'react';

import { Coupon } from '../../types';
import { ProductWithUI } from '../App';

interface useProuctFormaProps {
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export function useProductForm({
  setProducts,
  setShowProductForm,
  addNotification,
}: useProuctFormaProps) {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

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

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
  };

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
      addNotification('상품이 수정되었습니다.', 'success');
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
      addNotification('상품이 추가되었습니다.', 'success');
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return {
    startEditProduct,
    handleProductSubmit,
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
  };
}

export function useCouponForm(
  coupons: Coupon[],
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void,
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>,
  selectedCoupon: Coupon | null,
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>
) {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

  return {
    handleCouponSubmit,
    showCouponForm,
    setShowCouponForm,
    deleteCoupon,
    couponForm,
    setCouponForm,
  };
}
