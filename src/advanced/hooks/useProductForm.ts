import { useAtom } from "jotai";
import { useCallback } from "react";
import { ProductWithUI } from "../types/product";
import { INITIAL_PRODUCT_FORM } from "../utils/productUtils";
import { editingProductAtom, showProductFormAtom, productFormAtom } from "../atoms/productAtoms";

export const useProductForm = () => {
  /** 상품 관리 편집 - Jotai 사용 */
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);

  /** 상품 폼 표시 상태 - Jotai 사용 */
  const [showProductForm, setShowProductForm] = useAtom(showProductFormAtom);

  /** 상품 폼 데이터 - Jotai 사용 */
  const [productForm, setProductForm] = useAtom(productFormAtom);

  /** 상품 수정시 폼 초기값 설정 */
  const editProductForm = useCallback(
    (product: ProductWithUI) => {
      setEditingProduct(product.id);
      setProductForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || "",
        discounts: product.discounts || [],
      });
      setShowProductForm(true);
    },
    [setEditingProduct, setProductForm, setShowProductForm]
  );

  /** 상품 폼 초기화 */
  const clearProductForm = useCallback(() => {
    setProductForm(INITIAL_PRODUCT_FORM);
    setEditingProduct(null);
    setShowProductForm(false);
  }, [setProductForm, setEditingProduct, setShowProductForm]);

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
