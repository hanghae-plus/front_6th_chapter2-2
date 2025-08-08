import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ProductWithUI } from "../../basic/App";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useNotificationActions } from "./useNotification";

interface ProductContextActionsTypes {
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

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

const ProductContext = createContext<ProductWithUI[]>(initialProducts);
const ProductContextActions = createContext<ProductContextActionsTypes>({
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
});

export const ProductProvider = memo(({ children }: PropsWithChildren) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );
  const { addNotification } = useNotificationActions();

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

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  const actions = useMemo(
    () => ({
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [addProduct, updateProduct, deleteProduct]
  );

  return (
    <ProductContext.Provider value={products}>
      <ProductContextActions.Provider value={actions}>
        {children}
      </ProductContextActions.Provider>
    </ProductContext.Provider>
  );
});

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return context;
};

export const useProductActions = () => {
  const context = useContext(ProductContextActions);

  if (!context) {
    throw new Error("useProductActions must be used within a ProductProvider");
  }

  return context;
};
