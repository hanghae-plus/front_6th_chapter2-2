import { useCallback } from "react";
import { useAtom } from "jotai";
import { ProductWithUI } from "./product.types";
import {
  showProductFormAtom,
  editingProductAtom,
  productFormAtom,
} from "../../atoms";

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
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);
  const [showProductForm, setShowProductForm] = useAtom(showProductFormAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);

  const updateField = useCallback(
    (field: string, value: any) => {
      setProductForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setProductForm]
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
    [setProductForm, setEditingProduct, setShowProductForm]
  );

  const resetProductForm = useCallback(() => {
    setProductForm(initialProductForm);
    setEditingProduct(null);
  }, [setProductForm, setEditingProduct]);

  const hideProductForm = useCallback(() => {
    setShowProductForm(false);
    resetProductForm();
  }, [setShowProductForm, resetProductForm]);

  const showNewProductForm = useCallback(() => {
    setEditingProduct("new");
    setProductForm(initialProductForm);
    setShowProductForm(true);
  }, [setEditingProduct, setProductForm, setShowProductForm]);

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
