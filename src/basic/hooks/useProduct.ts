import { useReducer, useCallback } from "react";
import { ProductWithUI } from "../App";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import productService from "../services/product";

type ProductState = {
  products: ProductWithUI[];
};

type ProductAction =
  | { type: "ADD_PRODUCT"; payload: Omit<ProductWithUI, "id"> }
  | {
      type: "UPDATE_PRODUCT";
      payload: { productId: string; updates: Partial<ProductWithUI> };
    }
  | { type: "DELETE_PRODUCT"; payload: string };

function productReducer(
  state: ProductState,
  action: ProductAction
): ProductState {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const result = productService.addNewItem({
        products: state.products,
        product: action.payload,
      });

      if (result.status === "success") {
        return { ...state, products: result.value };
      }
      return state;
    }

    case "UPDATE_PRODUCT": {
      const result = productService.updateProduct({
        products: state.products,
        productId: action.payload.productId,
        updates: action.payload.updates,
      });

      if (result.status === "success") {
        return { ...state, products: result.value };
      }
      return state;
    }

    case "DELETE_PRODUCT": {
      const result = productService.deleteProduct({
        products: state.products,
        productId: action.payload,
      });

      if (result.status === "success") {
        return { ...state, products: result.value };
      }
      return state;
    }

    default:
      return state;
  }
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

export function useProduct() {
  const [storedProducts, setStoredProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const [state, dispatch] = useReducer(productReducer, {
    products: storedProducts,
  });

  const syncWithLocalStorage = useCallback(
    (newProducts: ProductWithUI[]) => {
      setStoredProducts(newProducts);
    },
    [setStoredProducts]
  );

  // 액션 함수들
  const addProduct = useCallback(
    (product: Omit<ProductWithUI, "id">) => {
      const result = productService.addNewItem({
        products: state.products,
        product,
      });

      if (result.status === "success") {
        dispatch({ type: "ADD_PRODUCT", payload: product });
        syncWithLocalStorage(result.value);
      }

      return result;
    },
    [state.products, syncWithLocalStorage]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = productService.updateProduct({
        products: state.products,
        productId,
        updates,
      });

      if (result.status === "success") {
        dispatch({
          type: "UPDATE_PRODUCT",
          payload: { productId, updates },
        });
        syncWithLocalStorage(result.value);
      }

      return result;
    },
    [state.products, syncWithLocalStorage]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      const result = productService.deleteProduct({
        products: state.products,
        productId,
      });

      if (result.status === "success") {
        dispatch({ type: "DELETE_PRODUCT", payload: productId });
        syncWithLocalStorage(result.value);
      }

      return result;
    },
    [state.products, syncWithLocalStorage]
  );

  // 검색 및 유틸리티 함수들
  const searchProduct = useCallback(
    (searchTerm: string) => {
      return productService.searchProduct({
        products: state.products,
        searchTerm,
      });
    },
    [state.products]
  );

  const getStockStatus = useCallback((product: ProductWithUI, cart: any[]) => {
    return productService.getStockStatus({ product, cart });
  }, []);

  const validateProductPrice = useCallback((price: string) => {
    return productService.validateProductPrice(price);
  }, []);

  const validateProductStock = useCallback((stock: string) => {
    return productService.validateProductStock(stock);
  }, []);

  return {
    products: state.products,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    getStockStatus,
    validateProductPrice,
    validateProductStock,
  };
}
