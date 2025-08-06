import { useState, useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { useForm } from "../../hooks/useForm";

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

  const productForm = useForm({
    initialValues: initialProductForm,
  });

  const startEditProduct = useCallback(
    (product: ProductWithUI) => {
      setEditingProduct(product.id);
      productForm.setAllValues({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || "",
        discounts: product.discounts || [],
      });
      productForm.show();
    },
    [productForm]
  );

  const resetAndClose = useCallback(() => {
    setEditingProduct(null);
    productForm.hide();
  }, [productForm]);

  return {
    productForm: productForm.values,
    setProductForm: productForm.setAllValues,
    editingProduct,
    setEditingProduct,
    showProductForm: productForm.isVisible,
    setShowProductForm: (show: boolean) =>
      show ? productForm.show() : productForm.hide(),
    startEditProduct,
    handleProductSubmit: productForm.handleSubmit,
    resetProductForm: resetAndClose,
  };
};
