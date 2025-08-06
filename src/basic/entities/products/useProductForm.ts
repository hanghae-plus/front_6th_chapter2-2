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
    setAllValues: setProductForm,
    reset,
    show,
    hide,
  } = useForm({
    initialValues: initialProductForm,
  });

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
    setProductForm(initialProductForm);
    setEditingProduct(null);
  }, [setProductForm]);

  const hideProductForm = useCallback(() => {
    setShowProductForm(false);
    resetProductForm();
  }, [resetProductForm]);

  const showNewProductForm = useCallback(() => {
    resetProductForm();
    setEditingProduct("new");
    setShowProductForm(true);
  }, [resetProductForm]);

  return {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    startEditProduct,
    resetProductForm,
    hideProductForm,
    showNewProductForm,
  };
};
