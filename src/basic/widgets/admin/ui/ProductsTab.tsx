import { useState, useCallback } from "react";
import { Product, ProductWithUI } from "../../../entities/product/types";
import { NotificationVariant } from "../../../entities/notification/types";
import { ProductTable } from "../../../features/view-product-list/ui/ProductTable";
import { formatPrice } from "../../../shared/libs/price";
import { getProductStockStatus } from "../../../features/check-stock/libs";
import { AddProductForm } from "../../../features/add-product/ui/AddProductForm";
import { EditProductForm } from "../../../features/edit-product/ui/EditProductForm";

interface ProductWithDisplayInfo extends ProductWithUI {
  displayedPrice: string;
}

interface ProductsTabProps {
  products: ProductWithUI[];
  setProducts: (products: ProductWithUI[]) => void;
  addNotification: (message: string, variant?: NotificationVariant) => void;
}

export function ProductsTab({
  products,
  setProducts,
  addNotification,
}: ProductsTabProps) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(
    null
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts([...products, product]);
      addNotification("상품이 추가되었습니다.", NotificationVariant.SUCCESS);
      setShowProductForm(false);
    },
    [products, setProducts, addNotification]
  );

  const updateProduct = useCallback(
    (updatedProduct: ProductWithUI) => {
      setProducts(
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      addNotification("상품이 수정되었습니다.", NotificationVariant.SUCCESS);
      setEditingProduct(null);
      setShowProductForm(false);
    },
    [products, setProducts, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(products.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", NotificationVariant.SUCCESS);
    },
    [products, setProducts, addNotification]
  );

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const cancelForm = () => {
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const displayPrice = (product: Product) => {
    const stockStatus = getProductStockStatus({ product, cartQuantity: 0 });
    if (stockStatus) return stockStatus;
    const formattedPrice = formatPrice(product.price);
    return `${formattedPrice}원`;
  };

  const productsWithDisplayInfo: ProductWithDisplayInfo[] = products.map(
    (product) => ({
      ...product,
      displayedPrice: displayPrice(product),
    })
  );

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={productsWithDisplayInfo}
        onEditButtonClick={startEditProduct}
        onDeleteButtonClick={deleteProduct}
      />

      {showProductForm && editingProduct && (
        <EditProductForm
          initialProduct={editingProduct}
          onSubmit={updateProduct}
          onCancel={cancelForm}
          addNotification={addNotification}
        />
      )}

      {showProductForm && !editingProduct && (
        <AddProductForm
          onSubmit={addProduct}
          onCancel={cancelForm}
          addNotification={addNotification}
        />
      )}
    </section>
  );
}
