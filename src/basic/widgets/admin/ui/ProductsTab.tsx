import { Product } from "../../../entities/product/types";
import { ProductTable } from "../../../features/view-product-list/ui/ProductTable";
import { formatPrice } from "../../../shared/libs/price";
import { getStockDisplay } from "../../../entities/product/libs/stock";
import { AddProductForm } from "../../../features/manage-products/ui/AddProductForm";
import { EditProductForm } from "../../../features/manage-products/ui/EditProductForm";
import { useManageProducts } from "../../../features/manage-products/hooks/useManageProducts";

export function ProductsTab() {
  const {
    products,
    showProductForm,
    editingProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    startAddingProduct,
    startEditingProduct,
    cancelProductForm,
  } = useManageProducts();

  const displayPrice = (product: Product) => {
    const stockStatus = getStockDisplay(product.stock, 0);
    if (stockStatus) return stockStatus;
    const formattedPrice = formatPrice(product.price);
    return `${formattedPrice}원`;
  };

  const productsWithDisplayInfo = products.map((product) => ({
    ...product,
    displayedPrice: displayPrice(product),
  }));

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={startAddingProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={productsWithDisplayInfo}
        onEdit={startEditingProduct}
        onDelete={deleteProduct}
      />

      {showProductForm &&
        (editingProduct ? (
          <EditProductForm
            initialProduct={editingProduct}
            onSubmit={updateProduct}
            onCancel={cancelProductForm}
          />
        ) : (
          <AddProductForm onSubmit={addProduct} onCancel={cancelProductForm} />
        ))}
    </section>
  );
}
