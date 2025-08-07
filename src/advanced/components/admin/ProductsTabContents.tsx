import { useState } from "react";
import { Product, ProductWithUI } from "../../../types";
import ProductFormPanel from "./ProductFormPanel";
import ProductTable from "./ProductTable";
import { productHandler } from "../../handlers/product";
import { useSetAtom } from "jotai";
import { addProductAtom, updateProductAtom } from "../../atoms/products";

interface ProductsTabContentsProps {
  getRemainingStock: (product: Product) => number;
}

const ProductsTabContents = ({
  getRemainingStock,
}: ProductsTabContentsProps) => {
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const updateProductAction = useSetAtom(updateProductAtom);
  const addProductAction = useSetAtom(addProductAtom);

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    addProductAction(newProduct);
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    updateProductAction({ productId, updates });
  };

  const { handleProductSubmit, startEditProduct } = productHandler(
    editingProduct,
    setEditingProduct,
    updateProduct,
    addProduct,
    productForm,
    setProductForm,
    setShowProductForm
  );

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
        <ProductTable
          startEditProduct={startEditProduct}
          getRemainingStock={getRemainingStock}
        />
      </div>
      {showProductForm && (
        <ProductFormPanel
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          handleProductSubmit={handleProductSubmit}
        />
      )}
    </section>
  );
};

export default ProductsTabContents;
