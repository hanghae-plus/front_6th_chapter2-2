import { ProductTable } from "@features/view-product-list/ui/ProductTable";
import { formatPrice } from "@shared/libs/price";
import { getStockDisplay } from "@entities/product";
import {
  AddProductForm,
  EditProductForm,
  useManageProducts,
} from "@features/manage-products";

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

  const displayPriceForAdmin = (product: { price: number; stock: number }) => {
    const stockStatus = getStockDisplay(product.stock, 0);
    if (stockStatus) return stockStatus;
    return `${formatPrice(product.price)}원`;
  };

  const productsWithDisplayInfo = products.map((product) => ({
    ...product,
    displayedPrice: displayPriceForAdmin(product),
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
