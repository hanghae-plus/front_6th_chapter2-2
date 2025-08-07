import React, { ChangeEvent, useCallback, useState } from 'react';
import { FormType } from '../components/admin/ProductTab.tsx';
import { ProductWithUI } from '../models/entities';

interface ProductFormState {
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
}

export const useProductForm = ({
  updateProduct,
  addNotification,
  addProduct,
}: ProductFormState) => {
  const [productForm, setProductForm] = useState<FormType>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const initEditProduct = () => setEditingProduct(null);
  const openForm = () => setShowProductForm(true);
  const closeForm = () => setShowProductForm(false);

  const onComplete = () => {
    initEditProduct();
    initializeForm();
    closeForm();
  };
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumberField = e.target.dataset.name === 'price';

    if (isNumberField) {
      if (!/^\d+$/.test(value) && value !== '') return; // 숫자가 아니면 업데이트 안함
    }
    setProductForm({
      ...productForm,
      [name]: value,
    });
  };

  const initializeForm = () => {
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
  };
  const handleNumberField = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setProductForm({
        ...productForm,
        [name]: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleNumberFieldBlur = useCallback(
    (fieldName: string) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === '') {
          setProductForm(prev => ({ ...prev, [fieldName]: 0 }));
        } else if (parseInt(value) < 0) {
          const displayName = fieldName === 'price' ? '가격' : '재고';
          addNotification(`${displayName}은 0보다 커야 합니다`, 'error');
          setProductForm(prev => ({ ...prev, [fieldName]: 0 }));
        }
      };
    },
    [addNotification]
  );
  const handleDiscountAdd = useCallback(() => {
    setProductForm(prev => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: 10, rate: 0.1 }],
    }));
  }, []);

  const handleDiscountUpdate = useCallback(
    (index: number, field: 'quantity' | 'rate') => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        const updatedValue = field === 'rate' ? value / 100 : value;

        setProductForm(prev => {
          const newDiscounts = [...prev.discounts];
          newDiscounts[index] = {
            ...newDiscounts[index],
            [field]: updatedValue,
          };
          return {
            ...prev,
            discounts: newDiscounts,
          };
        });
      };
    },
    []
  );

  const handleDiscountRemove = useCallback((index: number) => {
    return () => {
      setProductForm(prev => ({
        ...prev,
        discounts: prev.discounts.filter((_, i) => i !== index),
      }));
    };
  }, []);
  const handleAddDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      initEditProduct();
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    initializeForm();
    initEditProduct();
    closeForm();
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
    openForm();
  };

  const startNewAddProduct = () => {
    setEditingProduct('new');
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    openForm();
  };

  return {
    state: {
      editingProduct,
      productForm,
      showProductForm,
    },
    handler: {
      handleFieldChange,
      handleNumberField,
      handleNumberFieldBlur,
      handleDiscountAdd,
      handleDiscountUpdate,
      handleDiscountRemove,
      handleProductSubmit,
      handleAddDiscount,
    },

    util: {
      onComplete,
      startEditProduct,
      startNewAddProduct,
    },
  };
};
