import { useState } from 'react';
import { ProductFormType, ProductWithUI } from '../types/product';
import { initialProductFormData } from '../constants/product';

export const useProductForm = (
  addProduct: (product: ProductWithUI) => void,
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void
) => {
  // 상품 폼 표시 여부
  const [showProductForm, setShowProductForm] = useState(false);
  // 편집 중인 상품 ID
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const [productForm, setProductForm] = useState<ProductFormType>(initialProductFormData);

  // 상품 폼 제출 처리
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        id: '',
        name: productForm.name,
        price: productForm.price,
        stock: productForm.stock,
        description: productForm.description,
        discounts: productForm.discounts,
      });
    }
    // 폼 초기화
    setProductForm(initialProductFormData);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  // 상품 편집 시작
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

  return {
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    handleProductSubmit,
    startEditProduct,
  };
};
