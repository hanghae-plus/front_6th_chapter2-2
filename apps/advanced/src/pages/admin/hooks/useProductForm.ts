import { ProductView } from '@/models/product';
import { useState } from 'react';

const initialProductForm: Omit<ProductView, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: []
};

export const useProductForm = () => {
  const [form, setForm] = useState(initialProductForm);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const updateForm = (updates: Partial<Omit<ProductView, 'id'>>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(initialProductForm);
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = (product: ProductView) => {
    setEditingProduct(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description ?? '',
      discounts: product.discounts ?? []
    });
    setShowForm(true);
  };

  return {
    form,
    showForm,
    editingProduct,
    setShowForm,
    updateForm,
    resetForm,
    startEdit,
    handleChange
  };
};
