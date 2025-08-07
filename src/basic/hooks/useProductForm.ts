import { useState, useCallback } from 'react';
import { ProductWithUI } from '../datas/products';

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export const useProductForm = (
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void,
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void,
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void
) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: []
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: []
    });
    setEditingProduct(null);
    setShowForm(false);
  }, []);

  const startEdit = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    setShowForm(true);
  }, []);

  const startAdd = useCallback(() => {
    setEditingProduct('new');
    setFormData({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: []
    });
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct && editingProduct !== 'new') {
        updateProduct(editingProduct, formData);
        addNotification('상품이 수정되었습니다.', 'success');
      } else {
        addProduct({
          ...formData,
          discounts: formData.discounts
        });
        addNotification('상품이 추가되었습니다.', 'success');
      }
      resetForm();
    },
    [editingProduct, formData, addProduct, updateProduct, addNotification, resetForm]
  );

  const updateFormData = useCallback((updates: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const addDiscount = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: 10, rate: 0.1 }]
    }));
  }, []);

  const removeDiscount = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index)
    }));
  }, []);

  const updateDiscount = useCallback((index: number, updates: Partial<{ quantity: number; rate: number }>) => {
    setFormData(prev => ({
      ...prev,
      discounts: prev.discounts.map((discount, i) => (i === index ? { ...discount, ...updates } : discount))
    }));
  }, []);

  const validatePrice = useCallback(
    (value: string) => {
      if (value === '') {
        updateFormData({ price: 0 });
      } else if (parseInt(value) < 0) {
        addNotification('가격은 0보다 커야 합니다', 'error');
        updateFormData({ price: 0 });
      }
    },
    [updateFormData, addNotification]
  );

  const validateStock = useCallback(
    (value: string) => {
      if (value === '') {
        updateFormData({ stock: 0 });
      } else if (parseInt(value) < 0) {
        addNotification('재고는 0보다 커야 합니다', 'error');
        updateFormData({ stock: 0 });
      } else if (parseInt(value) > 9999) {
        addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
        updateFormData({ stock: 9999 });
      }
    },
    [updateFormData, addNotification]
  );

  return {
    showForm,
    editingProduct,
    formData,
    setShowForm,
    startEdit,
    startAdd,
    resetForm,
    handleSubmit,
    updateFormData,
    addDiscount,
    removeDiscount,
    updateDiscount,
    validatePrice,
    validateStock
  };
};
