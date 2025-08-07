import { useCallback, useId } from "react";
import { useLocalStorage } from "./useLocalStorage";

import { Product } from "../../types";
import { ProductNotFoundError, DuplicateProductNameError, ProductValidationError } from "../errors/Product.error";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { withTryNotifySuccess } from "../utils/withNotify";
import { useUniqueId } from "../utils/hooks/useUniqueId";

// 초기 데이터
const initialProducts: Product[] = [
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

export const useProducts = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  const [products, setProducts] = useLocalStorage<Product[]>("products", initialProducts);
  const generateId = useUniqueId();

  // 상품 추가
  const addProduct = useCallback(
    (newProduct: Omit<Product, "id">) => {
      // 상품명 중복 검사
      const existingProduct = products.find((p) => p.name === newProduct.name);
      if (existingProduct) {
        throw new DuplicateProductNameError(newProduct.name);
      }

      // 상품 유효성 검사
      if (newProduct.price < 0) {
        throw new ProductValidationError("상품 가격은 0원 이상이어야 합니다.");
      }

      if (newProduct.stock < 0) {
        throw new ProductValidationError("상품 재고는 0개 이상이어야 합니다.");
      }

      const product: Product = {
        ...newProduct,
        id: `product_${generateId()}`,
      };
      setProducts((prev) => [...prev, product]);
    },
    [products, generateId]
  );

  // 상품 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      // 상품 존재 여부 확인
      const existingProduct = products.find((p) => p.id === productId);
      if (!existingProduct) {
        throw new ProductNotFoundError(productId);
      }

      // 상품명 중복 검사 (다른 상품과 중복되지 않도록)
      if (updates.name) {
        const duplicateProduct = products.find((p) => p.name === updates.name && p.id !== productId);
        if (duplicateProduct) {
          throw new DuplicateProductNameError(updates.name);
        }
      }

      // 유효성 검사
      if (updates.price !== undefined && updates.price < 0) {
        throw new ProductValidationError("상품 가격은 0원 이상이어야 합니다.");
      }

      if (updates.stock !== undefined && updates.stock < 0) {
        throw new ProductValidationError("상품 재고는 0개 이상이어야 합니다.");
      }

      setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)));
    },
    [products]
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => {
      // 상품 존재 여부 확인
      const existingProduct = products.find((p) => p.id === productId);
      if (!existingProduct) {
        throw new ProductNotFoundError(productId);
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    },
    [products]
  );

  const handleAddProduct = useAutoCallback(
    withTryNotifySuccess(addProduct, "상품이 추가되었습니다.", addNotification ?? (() => {}))
  );
  const handleUpdateProduct = useAutoCallback(
    withTryNotifySuccess(updateProduct, "상품이 수정되었습니다.", addNotification ?? (() => {}))
  );
  const handleDeleteProduct = useAutoCallback(
    withTryNotifySuccess(deleteProduct, "상품이 삭제되었습니다.", addNotification ?? (() => {}))
  );

  return {
    products,
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
  };
};
