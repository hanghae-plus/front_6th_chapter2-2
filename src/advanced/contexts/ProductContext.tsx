import {
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
} from "react";
import { useLocalStorage } from "../hooks";
import { ProductWithUI } from "../models/product";
import {
  addProduct as _addProduct,
  updateProduct as _updateProduct,
  deleteProduct as _deleteProduct,
} from "../models/product";

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

interface ProductContextType {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: PropsWithChildren) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      setProducts((prev) => _addProduct(prev, newProduct));
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) => _updateProduct(prev, productId, updates));
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => _deleteProduct(prev, productId));
    },
    [setProducts]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }

  return context;
};
