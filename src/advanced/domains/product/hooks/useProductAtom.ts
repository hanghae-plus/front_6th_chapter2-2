import { useAtom, useAtomValue } from "jotai";

import { adminModeAtom, useNotifications } from "../../../shared";
import { cartAtom, getRemainingStock } from "../../cart";
import { productApplicationService } from "../services";
import { productsAtom } from "../store";
import type { Product, ProductForm, ProductWithUI } from "../types";
import { formatPrice } from "../utils";

export function useProductAtom() {
  const [products, setProducts] = useAtom(productsAtom);
  const cart = useAtomValue(cartAtom);
  const isAdminMode = useAtomValue(adminModeAtom);
  const { addNotification } = useNotifications();

  const deleteProduct = (productId: string) => {
    productApplicationService.deleteProduct(productId, setProducts, addNotification);
  };

  const handleProductSubmit = (
    productForm: ProductForm,
    editingProduct: string | null,
    resetForm: () => void,
    setEditingProduct: (id: string | null) => void,
    setShowForm: (show: boolean) => void
  ) => {
    productApplicationService.handleProductSubmit(
      productForm,
      editingProduct,
      setProducts,
      resetForm,
      setEditingProduct,
      setShowForm,
      addNotification
    );
  };

  const startEditProduct = (
    product: ProductWithUI,
    setEditingProduct: (id: string) => void,
    setProductForm: (form: ProductForm) => void,
    setShowForm: (show: boolean) => void
  ) => {
    productApplicationService.startEditProduct(
      product,
      setEditingProduct,
      setProductForm,
      setShowForm
    );
  };

  const formatPriceWithContext = (price: number, productId?: string) => {
    return formatPrice(price, productId, products, cart, isAdminMode);
  };

  const getRemainingStockWithCart = (product: Product) => {
    return getRemainingStock(product, cart);
  };

  return {
    products,
    deleteProduct,
    handleProductSubmit,
    startEditProduct,
    formatPrice: formatPriceWithContext,
    getRemainingStock: getRemainingStockWithCart
  };
}
