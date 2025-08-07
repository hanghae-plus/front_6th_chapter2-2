// 상품 폼 상태 관리 Hook
import { useState, useCallback } from "react";
import { ProductFormData, ProductWithUI } from "../type/types";

/**
 * 상품 폼 상태 관리 훅
 *
 * 주요 기능:
 * 1. 폼 데이터 상태 관리
 * 2. 편집 상태 관리 (신규/수정)
 * 3. 폼 표시/숨김 상태 관리
 * 4. 폼 초기화 및 제출 로직
 */
export function useProductForm() {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });

  // 폼 초기화
  const resetForm = useCallback(() => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  // 새 상품 추가 시작
  const startAddProduct = useCallback(() => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(true);
  }, []);

  // 상품 편집 시작
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

  // 폼 제출 처리
  const handleSubmit = useCallback(
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
      } else {
        onAddProduct({
          ...productForm,
          discounts: productForm.discounts,
        });
      }

      resetForm();
    },
    [editingProduct, productForm, resetForm]
  );

  // 폼 취소 처리
  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  return {
    // 상태
    editingProduct,
    showProductForm,
    productForm,

    // 액션
    setProductForm,
    startAddProduct,
    startEditProduct,
    handleSubmit,
    handleCancel,
    resetForm,
  };
}
