import { ProductWithUI } from "../../../../types";
import { useProductForm } from "../../../../hooks/admin/useProductForm";
import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";

interface ProductTabProps {
  products: ProductWithUI[];
  onAddProduct: (product: Omit<ProductWithUI, "id">) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (productId: string) => void;
  getRemainingStock: (product: ProductWithUI) => number;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function ProductTab({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  getRemainingStock,
  addNotification,
}: ProductTabProps) {
  const {
    productForm,
    setProductForm,
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    startEditProduct,
    handleProductSubmit,
  } = useProductForm();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              setShowProductForm(true);
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setEditingProduct("new");
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onDeleteProduct={onDeleteProduct}
        getRemainingStock={getRemainingStock}
        onEditProduct={startEditProduct}
      />

      {showProductForm && (
        <ProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          editingProduct={editingProduct}
          onSubmit={(e) => handleProductSubmit(e, onAddProduct, onUpdateProduct)}
          onCancel={() => {
            setShowProductForm(false);
            setProductForm({
              name: "",
              price: 0,
              stock: 0,
              description: "",
              discounts: [],
            });
          }}
          addNotification={addNotification}
        />
      )}
    </section>
  );
}
