import { useState } from "react";
import { useAtom } from "jotai";
import { ProductCreationPayload, ProductWithUI } from "../../../types";
import { productsAtom } from "../../../store/atoms/productAtoms";
import {
  handleAddProductAtom,
  removeProductAtom,
  updateProductAtom,
} from "../../../store/actions/productActions";

/**
 * 어드민 페이지 상품 관련 모든 상태와 액션을 캡슐화하는 커스텀 훅.
 */

export const useAdminProducts = () => {
  const [products] = useAtom(productsAtom);
  const [, addProduct] = useAtom(handleAddProductAtom);
  const [, updateProduct] = useAtom(updateProductAtom);
  const [, removeProduct] = useAtom(removeProductAtom);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductCreationPayload>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });

  // 상품 추가 또는 수정 함수
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct === "new") {
      addProduct(productForm);
    } else if (editingProduct) {
      updateProduct(editingProduct, productForm);
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
  };

  // 상품 수정 모드 시작 함수
  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  // 상품 삭제 함수
  const handleDeleteProduct = (productId: string) => {
    removeProduct(productId);
  };

  // 폼 입력값 변경 핸들러
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof ProductCreationPayload
  ) => {
    const { value } = e.target;
    if (key === "price" || key === "stock") {
      if (value === "" || /^\d+$/.test(value)) {
        setProductForm({
          ...productForm,
          [key]: value === "" ? 0 : parseInt(value),
        });
      }
    } else {
      setProductForm({
        ...productForm,
        [key]: value,
      });
    }
  };

  const startAddNewProduct = () => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(true);
  };

  const cancelForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(false);
  };

  return {
    products,
    showProductForm,
    editingProduct,
    productForm,
    handleProductSubmit,
    startEditProduct,
    handleDeleteProduct,
    handleFormChange,
    startAddNewProduct,
    cancelForm,
  };
};
