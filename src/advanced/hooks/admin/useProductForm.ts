import { useState, useCallback } from "react";
import { ProductFormData, ProductWithUI } from "../../types";
import { INITIAL_PRODUCT_FORM } from "../../constants";

export function useProductForm() {
  const [productForm, setProductForm] =
    useState<ProductFormData>(INITIAL_PRODUCT_FORM);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  }, []);

  const handleProductSubmit = useCallback(
    (
      e: React.FormEvent,
      onAddProduct: (product: Omit<ProductWithUI, "id">) => void,
      onUpdateProduct: (
        productId: string,
        updates: Partial<ProductWithUI>
      ) => void
    ) => {
      e.preventDefault();

      if (editingProduct && editingProduct !== "new") {
        onUpdateProduct(editingProduct, productForm);
        setEditingProduct(null);
      } else {
        onAddProduct({
          ...productForm,
          discounts: productForm.discounts,
        });
      }

      setProductForm(INITIAL_PRODUCT_FORM);
      setEditingProduct(null);
      setShowProductForm(false);
    },
    [editingProduct, productForm]
  );

  return {
    productForm,
    setProductForm,
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    startEditProduct,
    handleProductSubmit,
  };
}
