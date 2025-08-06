import React, { createContext, useContext, ReactNode } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNotificationContext } from "./NotificationContext";
import { ProductWithUI } from "../types";

interface ProductContextType {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

import { initialProducts } from "../data/initialData";

const ProductContext = createContext<ProductContextType>({
  products: initialProducts,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
});

export const useProductContext = () => {
  const context = useContext(ProductContext);
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const { addNotification } = useNotificationContext();
  const {
    products,
    addProduct: baseAddProduct,
    updateProduct: baseUpdateProduct,
    deleteProduct: baseDeleteProduct,
  } = useProducts();

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    baseAddProduct(newProduct, addNotification);
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    baseUpdateProduct(productId, updates, addNotification);
  };

  const deleteProduct = (productId: string) => {
    baseDeleteProduct(productId, addNotification);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
