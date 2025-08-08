import { useState } from 'react';
import { ProductWithUI } from '../../../types';
import {
  formatErrorMessageCRUD,
  formatErrorMessageProduct,
  formatExceedErrorMessage,
} from '../../utils/format';
import { useToggle } from '../../../shared/hooks/useToggle';

type ProductForm = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export function useProductList({
  addProduct,
  updateProduct,
}: {
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
}) {
  const { isOpen: showProductForm, toggle: toggleProductForm } = useToggle(false);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });

  const handleProductSubmit = (e: React.FormEvent): { success: boolean; message?: string } => {
    e.preventDefault();

    // Validate all fields before submit
    const priceValidation = validateProductForm('price', productForm.price);
    if (!priceValidation.isValid) {
      return { success: false, message: priceValidation.message };
    }

    const stockValidation = validateProductForm('stock', productForm.stock);
    if (!stockValidation.isValid) {
      return { success: false, message: stockValidation.message };
    }

    // Check required fields
    if (!productForm.name.trim()) {
      return { success: false, message: '상품명을 입력해주세요.' };
    }

    try {
      if (editingProduct && editingProduct !== 'new') {
        updateProduct(editingProduct, productForm);
        setEditingProduct(null);
      } else {
        addProduct({
          ...productForm,
          discounts: productForm.discounts,
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: formatErrorMessageCRUD('상품', '추가') };
    }
  };

  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    toggleProductForm();
  };

  const handleNewProduct = () => {
    setEditingProduct('new');
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    toggleProductForm();
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setEditingProduct(null);
    toggleProductForm();
  };

  // Form validation helpers
  const validateProductForm = (field: keyof ProductForm, value: any): ValidationResult => {
    switch (field) {
      case 'price':
        if (value < 0) {
          return { isValid: false, message: formatErrorMessageProduct('가격', 0) };
        }
        return { isValid: true };
      case 'stock':
        if (value < 0) {
          return { isValid: false, message: formatErrorMessageProduct('재고', 0) };
        }
        if (value > 9999) {
          return { isValid: false, message: formatExceedErrorMessage('재고', 9999) };
        }
        return { isValid: true };
      default:
        return { isValid: true };
    }
  };

  // Form update helpers
  const handleProductFormChange = (updates: Partial<ProductForm>) => {
    setProductForm((prev) => ({ ...prev, ...updates }));
  };

  return {
    // Product form state
    showProductForm,
    toggleProductForm,
    editingProduct,
    productForm,
    resetProductForm,

    // Product form handlers
    handleProductSubmit,
    handleNewProduct,
    handleEditProduct,
    handleProductFormChange,

    // Validation
    validateProductForm,
  };
}
