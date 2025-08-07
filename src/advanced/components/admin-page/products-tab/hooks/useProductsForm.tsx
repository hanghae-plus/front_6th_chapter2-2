import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ProductWithUI } from '../../../../../types';
import { useNotify } from '../../../../hooks/useNotification';
import { useAddProduct, useUpdateProduct } from '../../../../hooks/useProducts';
import { useProductFormValidation } from '../../../../utils/hooks/useValidate';

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
  const { validatePrice, validateStock, validateRate, displayValues } =
    useProductFormValidation();

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
    if (validatePrice.validatePriceInput(value)) {
      updateProductForm({
        price: validatePrice.normalizePrice(value),
      });
    }
  };

  const handlePriceBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      updateProductForm({ price: 0 });
    } else {
      const normalizedPrice = validatePrice.normalizePrice(value);
      const priceValidation =
        validatePrice.validatePriceIndividual(normalizedPrice);

      if (!priceValidation.isValid) {
        notify({
          message: priceValidation.errorMessage!,
          type: 'error',
        });
        updateProductForm({ price: 0 });
      }
    }
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateStock.validateStockInput(value)) {
      updateProductForm({
        stock: validateStock.normalizeStock(value),
      });
    }
  };

  const handleStockBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      updateProductForm({ stock: 0 });
    } else {
      const normalizedStock = validateStock.normalizeStock(value);
      const stockValidation =
        validateStock.validateStockIndividual(normalizedStock);

      if (!stockValidation.isValid) {
        notify({
          message: stockValidation.errorMessage!,
          type: 'error',
        });
        updateProductForm({ stock: stockValidation.correctedValue! });
      }
    }
  };

  // 할인 관련 핸들러들
  const handleDiscountQuantityChange =
    ({ index }: { index: number }) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].quantity = parseInt(e.target.value) || 0;
      updateProductForm({
        discounts: newDiscounts,
      });
    };

  const handleDiscountRateChange =
    ({ index }: { index: number }) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].rate = validateRate.normalizeRate(e.target.value);
      updateProductForm({
        discounts: newDiscounts,
      });
    };

  const handleRemoveDiscount =
    ({ index }: { index: number }) =>
    () => {
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
  const getDisplayValue = ({ value }: { value: number }) =>
    displayValues.getDisplayValue(value);
  const getDiscountRateDisplay = ({ rate }: { rate: number }) =>
    displayValues.getDiscountRateDisplay(rate);

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
