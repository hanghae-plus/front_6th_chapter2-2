import { useState, useCallback } from "react";
import { useAtom } from "jotai"; // ✅ Jotai 추가
import { productsAtom } from "../atoms"; // ✅ Jotai atom 사용
import { ProductWithUI } from "../../types";

interface UseProductsProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function useProducts({ addNotification }: UseProductsProps) {
  // ✅ useLocalStorage 대신 Jotai atom 사용
  const [products, setProducts] = useAtom(productsAtom);

  // 상품 폼 관련 상태들
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  /**
   * 새 상품 추가
   */
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]); // ✅ Jotai atom 업데이트
      addNotification("상품이 추가되었습니다.", "success");
    },
    [setProducts, addNotification] // ✅ dependencies 수정
  );

  /**
   * 기존 상품 정보 업데이트
   */
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      ); // ✅ Jotai atom 업데이트
      addNotification("상품이 수정되었습니다.", "success");
    },
    [setProducts, addNotification] // ✅ dependencies 수정
  );

  /**
   * 상품 삭제
   */
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId)); // ✅ Jotai atom 업데이트
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [setProducts, addNotification] // ✅ dependencies 수정
  );

  /**
   * 상품 폼 표시
   */
  const showProductFormHandler = useCallback(() => {
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

  /**
   * 상품 폼 필드 변경
   */
  const updateProductForm = useCallback((field: string, value: any) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * 상품 폼 취소
   */
  const cancelProductForm = useCallback(() => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(false);
  }, []);

  /**
   * 상품 편집 시작
   */
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

  /**
   * 할인 추가
   */
  const addDiscount = useCallback(() => {
    setProductForm((prev) => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: 10, rate: 0.1 }],
    }));
  }, []);

  /**
   * 할인 제거
   */
  const removeDiscount = useCallback((index: number) => {
    setProductForm((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  }, []);

  /**
   * 상품 폼 제출
   */
  const submitProductForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct && editingProduct !== "new") {
        updateProduct(editingProduct, productForm);
        setEditingProduct(null);
      } else {
        addProduct({
          ...productForm,
          discounts: productForm.discounts,
        });
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
    },
    [editingProduct, productForm, addProduct, updateProduct]
  );

  // =====================================
  // 반환값
  // =====================================

  return {
    products,
    showProductForm,
    editingProduct,
    productForm,

    onShowProductForm: showProductFormHandler,
    onProductSubmit: submitProductForm,
    onProductFormChange: updateProductForm,
    onCancelProductForm: cancelProductForm,
    onStartEditProduct: startEditProduct,
    onDeleteProduct: deleteProduct,
    onAddDiscount: addDiscount,
    onRemoveDiscount: removeDiscount,
  };
}
