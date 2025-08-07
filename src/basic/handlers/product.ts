import { Dispatch, SetStateAction } from "react";
import { AddNotification, ProductForm, ProductWithUI } from "../../types";
import { NOTIFICATION_MESSAGE } from "../constants";

export const productHandler = (
  editingProduct: string | null,
  setEditingProduct: Dispatch<SetStateAction<string | null>>,
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void,
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void,
  productForm: ProductForm,
  setProductForm: Dispatch<SetStateAction<ProductForm>>,
  setShowProductForm: Dispatch<SetStateAction<boolean>>,
  addNotification: AddNotification
) => {
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
      addNotification(NOTIFICATION_MESSAGE.PRODUCT.UPDATE, "success");
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
      addNotification(NOTIFICATION_MESSAGE.PRODUCT.ADD, "success");
    }
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  return { handleProductSubmit, startEditProduct };
};
