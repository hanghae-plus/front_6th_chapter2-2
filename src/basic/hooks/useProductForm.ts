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

  // 범용 필드 업데이트 함수
  const updateField = useCallback((field: keyof ProductFormState, value: string | number | any[]) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // 폼 제출 처리 (실제 추가/수정 로직은 외부에서 처리)
  const handleProductSubmit = useCallback(
    (
      e: React.FormEvent,
      onAdd: (product: Omit<Product, "id">) => void,
      onUpdate: (productId: string, updates: Partial<Product>) => void
    ) => {
      e.preventDefault();

      const productData = {
        ...productForm,
        discounts: productForm.discounts,
      };

      // 수정
      if (editingProduct && editingProduct !== "new") {
        onUpdate(editingProduct, productData);
      }
      // 추가
      else {
        onAdd(productData);
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

    // 범용 필드 업데이트
    updateField,

    // 액션
    startEditProduct,
    startAddProduct,
    cancelProductForm,
    handleProductSubmit,
  };
};
