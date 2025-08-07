import { useAtom, useSetAtom } from "jotai";
import { ProductWithUI } from "../models/product";
import {
  addProductActionAtom,
  updateProductActionAtom,
  deleteProductActionAtom,
  startEditProductActionAtom,
  addDiscountActionAtom,
  removeDiscountActionAtom,
  updateDiscountQuantityActionAtom,
  updateDiscountRateActionAtom,
} from "../atoms/productActions";
import {
  productsAtom,
  productFormAtom,
  editingProductAtom,
} from "../atoms/appAtoms";
import { percentToDecimal } from "../utils/formatters";

export const useProducts = () => {
  // Atom states
  const [products, setProducts] = useAtom(productsAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);

  // Atom actions
  const addProductAction = useSetAtom(addProductActionAtom);
  const updateProductAction = useSetAtom(updateProductActionAtom);
  const deleteProductAction = useSetAtom(deleteProductActionAtom);
  const startEditProductAction = useSetAtom(startEditProductActionAtom);
  const addDiscountAction = useSetAtom(addDiscountActionAtom);
  const removeDiscountAction = useSetAtom(removeDiscountActionAtom);
  const updateDiscountQuantityAction = useSetAtom(
    updateDiscountQuantityActionAtom
  );
  const updateDiscountRateAction = useSetAtom(updateDiscountRateActionAtom);

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    addProductAction({ newProduct });
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    updateProductAction({ productId, updates });
  };

  const deleteProduct = (productId: string) => {
    deleteProductAction(productId);
  };

  return {
    products,
    setProducts,
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,

    addProductAction,
    updateProductAction,
    deleteProductAction,
    startEditProductAction,

    addProduct,
    updateProduct,
    deleteProduct,

    addDiscountAction,
    removeDiscountAction,
    updateDiscountQuantityAction,
    updateDiscountRateAction,

    percentToDecimal,
  };
};
