import { useState, useCallback } from "react";
import { ProductWithUI } from "../models";
import { useLocalStorage } from "../../../shared/hooks";
import { initialProducts } from "../constants";
import {
  addProductToList,
  updateProductInList,
  removeProductFromList,
} from "../utils";

export const useProducts = () => {
  const [products, setProducts] = useLocalStorage("products", initialProducts);

  // 상품 폼 관련 상태
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  // 상품 추가
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: Date.now().toString(),
      };

      setProducts((prev) => addProductToList(prev, product));
      setShowProductForm(false);
      setProductForm({
        name: "",
        price: 0,
        stock: 0,
        description: "",
        discounts: [],
      });
    },
    [setProducts]
  );

  // 상품 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) => updateProductInList(prev, productId, updates));
      setEditingProduct(null);
      setShowProductForm(false);
      setProductForm({
        name: "",
        price: 0,
        stock: 0,
        description: "",
        discounts: [],
      });
    },
    [setProducts]
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => removeProductFromList(prev, productId));
    },
    [setProducts]
  );

  // 상품 편집 시작
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

  // 상품 폼 제출 처리
  const handleProductSubmit = useCallback(
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
    [editingProduct, productForm, updateProduct, addProduct]
  );

  return {
    products,
    editingProduct,
    showProductForm,
    productForm,
    setEditingProduct,
    setShowProductForm,
    setProductForm,
    addProduct,
    updateProduct,
    deleteProduct,
    startEditProduct,
    handleProductSubmit,
  };
};
