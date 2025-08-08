import { useAtomValue, useSetAtom } from "jotai";
import { productsAtom, addProductAtom, updateProductAtom, deleteProductAtom } from "../../../stores/productStore";
import { cartAtom } from "../../../stores/cartStore";
import { addNotificationAtom } from "../../../stores/notificationStore";
import { useProductForm } from "../../../hooks/useProductForm";
import { withTryNotifySuccess } from "../../../utils/withNotify";
import ProductManagement from "../../../components/admin/ProductManagement";
import type { NotificationType } from "../../../types/admin";
import { Product } from "../../../../types";

export default function ProductManagementFeature() {
  const products = useAtomValue(productsAtom);
  const cart = useAtomValue(cartAtom);
  const addProductSet = useSetAtom(addProductAtom);
  const updateProductSet = useSetAtom(updateProductAtom);
  const deleteProductSet = useSetAtom(deleteProductAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);

  const {
    editingProduct,
    productForm,
    showProductForm,
    updateField: updateProductField,
    startEditProduct,
    startAddProduct,
    cancelProductForm,
    handleProductSubmit,
  } = useProductForm();

  const handleDeleteProduct = withTryNotifySuccess(
    (productId: string) => deleteProductSet(productId),
    "상품이 삭제되었습니다.",
    (message: string, type: NotificationType) => addNotificationSet({ message, type })
  );

  const handleAddProduct = withTryNotifySuccess(
    (product: Omit<Product, "id">) => addProductSet(product),
    "상품이 추가되었습니다.",
    (message: string, type: NotificationType) => addNotificationSet({ message, type })
  );

  const handleUpdateProduct = withTryNotifySuccess(
    (productId: string, updates: Partial<Product>) => updateProductSet({ productId, updates }),
    "상품이 수정되었습니다.",
    (message: string, type: NotificationType) => addNotificationSet({ message, type })
  );

  const handleProductFormSubmit = (e: React.FormEvent) => {
    handleProductSubmit(e, handleAddProduct, handleUpdateProduct);
  };

  return (
    <ProductManagement
      products={products}
      cart={cart}
      onEditProduct={startEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onAddProduct={startAddProduct}
      showProductForm={showProductForm}
      productForm={productForm}
      updateField={updateProductField}
      editingProduct={editingProduct}
      onProductSubmit={handleProductFormSubmit}
      onCancelProductForm={cancelProductForm}
      addNotification={(message: string, type: NotificationType) => addNotificationSet({ message, type })}
    />
  );
}
