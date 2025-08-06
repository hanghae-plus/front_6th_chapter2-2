import { useState, useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { useForm } from "../../utils/hooks";

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

const initialProductForm: ProductFormData = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

export const useProductForm = () => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const {
    values: productForm,
    setValue,
    setAllValues: setProductForm,
    reset,
    show,
    hide,
  } = useForm({
    initialValues: initialProductForm,
  });

  const updateField = useCallback(
    (field: string, value: any) => {
      setValue(field as keyof ProductFormData, value);
    },
    [setValue]
  );

  const startEditProduct = useCallback(
    (product: ProductWithUI) => {
      setEditingProduct(product.id);
      setProductForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || "",
        discounts: product.discounts,
      });
      setShowProductForm(true);
    },
    [setProductForm]
  );

  const resetProductForm = useCallback(() => {
    reset();
    setEditingProduct(null);
  }, [reset]);

  const hideProductForm = useCallback(() => {
    hide();
    setShowProductForm(false);
    resetProductForm();
  }, [hide, resetProductForm]);

  const showNewProductForm = useCallback(() => {
    setEditingProduct("new");
    reset();
    setShowProductForm(true);
  }, [reset]);

  return {
    // 상태
    productForm,
    editingProduct,
    showProductForm,

    // 상태 변경 핸들러들
    setEditingProduct,
    setShowProductForm,
    updateField,

    // 복합 액션들
    startEditProduct,
    resetProductForm,
    hideProductForm,
    showNewProductForm,
  };
};
