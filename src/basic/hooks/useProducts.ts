import { useState, useCallback } from "react";
import { ProductWithUI } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

interface UseProductsProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

// 초기 상품 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

export function useProducts({ addNotification }: UseProductsProps) {
  // =====================================
  // 상태 관리
  // =====================================

  // 로컬스토리지에서 상품 목록을 불러와 초기화
  const [products, setProducts] = useLocalStorage("products", initialProducts);

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

  // =====================================
  // 상품 관리 함수
  // =====================================

  /**
   * 새 상품 추가
   */
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
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
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  /**
   * 상품 삭제
   */
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  // =====================================
  // 폼 관리 함수들
  // =====================================

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
