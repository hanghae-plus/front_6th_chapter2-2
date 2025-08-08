import { type FormEvent, useState } from "react";

import type { ProductForm, ProductWithUI } from "../types";
import { useProductAtom } from "./useProductAtom";

export function useProductForm() {
  const { handleProductSubmit, startEditProduct } = useProductAtom();

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: []
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleProductSubmit(
      productForm,
      editingProduct,
      resetForm,
      setEditingProduct,
      setShowProductForm
    );
  };

  const startEdit = (product: ProductWithUI) => {
    startEditProduct(product, setEditingProduct, setProductForm, setShowProductForm);
  };

  const handleAddNew = () => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: []
    });
    setShowProductForm(true);
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: []
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    resetForm();
    setShowProductForm(false);
  };

  return {
    // 상태
    productForm,
    editingProduct,
    showProductForm,

    // 액션
    setProductForm,
    handleSubmit,
    startEdit,
    handleAddNew,
    handleCancel
  };
}
