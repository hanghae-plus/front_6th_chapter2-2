import { useState } from 'react';
import { ProductWithUI } from '../../../types';

export const useProductForm = (
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void,
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void,
) => {
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const handleProductSubmit = (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    onSuccess?.();
  };

  return {
    productForm,
    setProductForm,
    handleProductSubmit,
    editingProduct,
    setEditingProduct,
  };
};
