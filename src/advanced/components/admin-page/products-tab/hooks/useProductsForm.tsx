import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ProductWithUI } from '../../../../../types';
import { useNotify } from '../../../../hooks/useNotification';
import { useAddProduct, useUpdateProduct } from '../../../../hooks/useProducts';

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: { quantity: number; rate: number }[];
}

export function useProductsForm() {
  const notify = useNotify();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const defaultValue: ProductForm = {
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  };
  const [productForm, setProductForm] = useState(defaultValue);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const clearProductForm = () => {
    setProductForm(defaultValue);
  };

  const closeProductForm = () => {
    clearProductForm();
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const updateProductForm = (updates: Partial<ProductForm>) => {
    setProductForm((prevForm) => ({ ...prevForm, ...updates }));
  };

  const openProductForm = () => {
    setEditingProduct('new');
    clearProductForm();
    setShowProductForm(true);
  };

  const editProductForm = ({ product }: { product: ProductWithUI }) => {
    const { id, description = '', discounts = [], ...values } = product;
    setEditingProduct(id);
    updateProductForm({
      ...values,
      description,
      discounts,
    });
    setShowProductForm(true);
  };

  const handleSubmitProductForm = (e: FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct({
        productId: editingProduct,
        updates: productForm,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        newProduct: {
          ...productForm,
          discounts: productForm.discounts,
        },
      });
    }
    closeProductForm();
  };

  // Input 핸들러들
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProductForm({ name: e.target.value });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProductForm({ description: e.target.value });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      updateProductForm({
        price: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handlePriceBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      updateProductForm({ price: 0 });
    } else if (parseInt(value) < 0) {
      notify({
        message: '가격은 0보다 커야 합니다',
        type: 'error',
      });
      updateProductForm({ price: 0 });
    }
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      updateProductForm({
        stock: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleStockBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      updateProductForm({ stock: 0 });
    } else if (parseInt(value) < 0) {
      notify({
        message: '재고는 0보다 커야 합니다',
        type: 'error',
      });
      updateProductForm({ stock: 0 });
    } else if (parseInt(value) > 9999) {
      notify({
        message: '재고는 9999개를 초과할 수 없습니다',
        type: 'error',
      });
      updateProductForm({ stock: 9999 });
    }
  };

  // 할인 관련 핸들러들
  const handleDiscountQuantityChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].quantity = parseInt(e.target.value) || 0;
      updateProductForm({
        discounts: newDiscounts,
      });
    };

  const handleDiscountRateChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
      updateProductForm({
        discounts: newDiscounts,
      });
    };

  const handleRemoveDiscount = (index: number) => () => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
    updateProductForm({
      discounts: newDiscounts,
    });
  };

  const handleAddDiscount = () => {
    updateProductForm({
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  // 표시용 값들
  const getDisplayValue = (value: number) =>
    value === 0 ? '' : value.toString();
  const getDiscountRateDisplay = (rate: number) => rate * 100;

  return {
    showProductForm,
    editingProduct,
    productForm,
    updateProductForm,
    clearProductForm,
    handleSubmitProductForm,
    closeProductForm,
    openProductForm,
    editProductForm,
    // Input 핸들러들
    handleNameChange,
    handleDescriptionChange,
    handlePriceChange,
    handlePriceBlur,
    handleStockChange,
    handleStockBlur,
    // 할인 관련 핸들러들
    handleDiscountQuantityChange,
    handleDiscountRateChange,
    handleRemoveDiscount,
    handleAddDiscount,
    // 표시용 값들
    getDisplayValue,
    getDiscountRateDisplay,
  };
}
