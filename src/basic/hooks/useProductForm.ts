import { useState, useCallback } from "react";
import { Product } from "../../types";
import { ProductFormState, INITIAL_PRODUCT_FORM } from "../types/admin";

export const useProductForm = () => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(INITIAL_PRODUCT_FORM);
  const [showProductForm, setShowProductForm] = useState(false);

  // 상품 편집 시작
  const startEditProduct = useCallback((product: Product) => {
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

  // 새 상품 추가 시작
  const startAddProduct = useCallback(() => {
    console.log("startAddProduct");
    setEditingProduct("new");
    setProductForm(INITIAL_PRODUCT_FORM);
    setShowProductForm(true);
  }, []);

  // 폼 취소
  const cancelProductForm = useCallback(() => {
    setEditingProduct(null);
    setProductForm(INITIAL_PRODUCT_FORM);
    setShowProductForm(false);
  }, []);

  // 폼 제출 처리 (실제 추가/수정 로직은 외부에서 처리)
  const handleProductSubmit = useCallback(
    (
      e: React.FormEvent,
      onAdd: (product: Omit<Product, "id">) => void,
      onUpdate: (productId: string, updates: Partial<Product>) => void
    ) => {
      e.preventDefault();

      if (editingProduct && editingProduct !== "new") {
        // 수정
        onUpdate(editingProduct, productForm);
      } else {
        // 추가
        onAdd({
          ...productForm,
          discounts: productForm.discounts,
        });
      }

      // 폼 리셋
      cancelProductForm();
    },
    [editingProduct, productForm, cancelProductForm]
  );

  return {
    // 상태
    editingProduct,
    productForm,
    showProductForm,

    // 상태 설정자
    setProductForm,

    // 액션
    startEditProduct,
    startAddProduct,
    cancelProductForm,
    handleProductSubmit,
  };
};
