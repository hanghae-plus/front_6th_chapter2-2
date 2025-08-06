import { useState } from 'react';

import type { ProductWithUI } from '../constants';
import { initialProductForm, ProductForm } from '../models/product';
import { useForm } from '../utils/hooks/useForm';

interface UseProductFormProps {
  onAddProduct: (product: ProductForm) => void;
  onUpdateProduct: (productId: string, product: ProductForm) => void;
}

export function useProductForm({ onAddProduct, onUpdateProduct }: UseProductFormProps) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productFormData, updateProductFormData, resetProductFormData] =
    useForm<ProductForm>(initialProductForm);

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    updateProductFormData(product);
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      onUpdateProduct(editingProduct, productFormData);
      setEditingProduct(null);
    } else {
      onAddProduct(productFormData);
    }
    resetProductFormData();
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleShowProductForm = () => {
    () => {
      setEditingProduct('new');
      resetProductFormData();
      setShowProductForm(true);
    };
  };

  const handleCancelProductForm = () => {
    setEditingProduct(null);
    resetProductFormData();
    setShowProductForm(false);
  };

  return {
    showProductForm,
    editingProduct,
    productFormData,
    updateProductFormData,
    startEditProduct,
    handleProductSubmit,
    handleShowProductForm,
    handleCancelProductForm,
  };
}
