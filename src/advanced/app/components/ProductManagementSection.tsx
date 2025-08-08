import {
  ProductFormEditor,
  ProductTable,
  useProductAtom,
  useProductForm
} from "../../domains/product";
import { Button } from "../../shared";

export function ProductManagementSection() {
  const { products, deleteProduct, formatPrice } = useProductAtom();
  const {
    productForm,
    editingProduct,
    showProductForm,
    setProductForm,
    handleSubmit,
    startEdit,
    handleAddNew,
    handleCancel
  } = useProductForm();

  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button onClick={handleAddNew} color="dark" className="rounded-md text-sm">
            새 상품 추가
          </Button>
        </div>
      </div>

      <ProductTable
        products={products}
        formatPrice={formatPrice}
        onEdit={startEdit}
        onDelete={deleteProduct}
      />

      {showProductForm && (
        <ProductFormEditor
          productForm={productForm}
          editingProduct={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onFormChange={setProductForm}
        />
      )}
    </section>
  );
}
