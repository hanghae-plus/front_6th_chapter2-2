import { useState } from "react";
import { ProductWithUI } from "../../../App";
import { ProductListTable } from "./ProductListTable";
import { ProductForm } from "./ProductForm";

export function ProductTab({
  activeTab,
}: {
  activeTab: "products" | "coupons";
}) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Omit<ProductWithUI, "id">>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

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

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductListTable
          activeTab={activeTab}
          startEditProduct={startEditProduct}
        />
      </div>
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
        />
      )}
    </section>
  );
}
