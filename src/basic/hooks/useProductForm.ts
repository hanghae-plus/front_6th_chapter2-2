import { useState, useCallback } from "react";
import { NewProductForm, ProductWithUI } from "../types/product";
import { INITIAL_PRODUCT_FORM } from "../utils/productUtils";

export const useProductForm = () => {
  /** 상품 관리 편집 */
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  /** 상품 폼 표시 상태 */
  const [showProductForm, setShowProductForm] = useState(false);

  /** 상품 폼 데이터 */
  const [productForm, setProductForm] = useState<NewProductForm>(INITIAL_PRODUCT_FORM);

  /** 상품 수정시 폼 초기값 설정 */
  const editProductForm = useCallback((product: ProductWithUI) => {
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

  /** 상품 폼 초기화 */
  const clearProductForm = useCallback(() => {
    setProductForm(INITIAL_PRODUCT_FORM);
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  return {
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    productForm,
    setProductForm,
    editProductForm,
    clearProductForm,
  };
};
