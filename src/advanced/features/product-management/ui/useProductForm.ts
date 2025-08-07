import { useState } from 'react';

import { type ProductWithUI } from '../../../entities/product';
import { useForm } from '../../../shared/hooks';

const initialProductForm: Omit<ProductWithUI, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
};

export function useProductForm() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productFormData, updateProductFormData, resetProductFormData] =
    useForm<Omit<ProductWithUI, 'id'>>(initialProductForm);

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    updateProductFormData(product);
    setShowProductForm(true);
  };

  const handleShowProductForm = () => {
    setEditingProduct('new');
    resetProductFormData();
    setShowProductForm(true);
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
    handleShowProductForm,
    handleCancelProductForm,
  };
}
