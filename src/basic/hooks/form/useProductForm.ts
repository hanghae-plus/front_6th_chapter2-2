import { useState } from 'react';

import { ProductWithUI } from '../../types';

const useProductForm = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const handleProductFormSubmit = () => {
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setShowProductForm(false);
  };

  const startEditProduct = (product: ProductWithUI | string) => {
    if (typeof product === 'string') {
      setEditingProduct(product);
    } else {
      setEditingProduct(product.id);
      setProductForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        discounts: product.discounts || [],
      });
    }
    setShowProductForm(true);
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

  const resetEditingProduct = () => {
    setEditingProduct(null);
  };

  const updateProductForm = (form: Partial<ProductWithUI>) => {
    setProductForm((prev) => ({ ...prev, ...form }));
  };

  const updateShowProductForm = (show: boolean) => {
    setShowProductForm(show);
  };

  return {
    productForm,
    showProductForm,
    editingProduct,
    handleProductFormSubmit,
    startEditProduct,
    handleCancelProduct,
    updateProductForm,
    updateShowProductForm,
    resetEditingProduct,
  };
};

export { useProductForm };
