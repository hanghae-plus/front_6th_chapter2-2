import type { NotificationFunction } from "../../../shared";
import type { ProductForm, ProductWithUI } from "../types";
import { productNotificationService } from "./productNotificationService";

type ProductUpdater = (updater: (prev: ProductWithUI[]) => ProductWithUI[]) => void;

export const productApplicationService = {
  addProduct: (
    newProduct: Omit<ProductWithUI, "id">,
    updateProducts: ProductUpdater,
    addNotification: NotificationFunction
  ) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };

    updateProducts((prev) => [...prev, product]);
    productNotificationService.showAddSuccess(addNotification);
  },

  updateProduct: (
    productId: string,
    updates: Partial<ProductWithUI>,
    updateProducts: ProductUpdater,
    addNotification: NotificationFunction
  ) => {
    updateProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
    productNotificationService.showUpdateSuccess(addNotification);
  },

  deleteProduct: (
    productId: string,
    updateProducts: ProductUpdater,
    addNotification: NotificationFunction
  ) => {
    updateProducts((prev) => prev.filter((p) => p.id !== productId));
    productNotificationService.showDeleteSuccess(addNotification);
  },

  handleProductSubmit: (
    productForm: ProductForm,
    editingProduct: string | null,
    updateProducts: ProductUpdater,
    resetForm: () => void,
    setEditingProduct: (id: string | null) => void,
    setShowForm: (show: boolean) => void,
    addNotification: NotificationFunction
  ) => {
    if (editingProduct && editingProduct !== "new") {
      productApplicationService.updateProduct(
        editingProduct,
        productForm,
        updateProducts,
        addNotification
      );
      setEditingProduct(null);
    } else {
      productApplicationService.addProduct(
        {
          ...productForm,
          discounts: productForm.discounts
        },
        updateProducts,
        addNotification
      );
    }

    resetForm();
    setEditingProduct(null);
    setShowForm(false);
  },

  startEditProduct: (
    product: ProductWithUI,
    setEditingProduct: (id: string) => void,
    setProductForm: (form: ProductForm) => void,
    setShowForm: (show: boolean) => void
  ) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || []
    });
    setShowForm(true);
  }
};
