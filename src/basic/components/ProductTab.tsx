import { useState, useCallback } from "react";
import { IProductForm, IProductWithUI } from "../type";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

interface ProductTabProps {
  // product
  products: IProductWithUI[];
  addProduct: (newProduct: Omit<IProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<IProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  getRemainingStock: (product: IProductWithUI) => number;

  // notification
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const ProductTab = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  getRemainingStock,
  addNotification,
}: ProductTabProps) => {
  // 상품 추가 (수정) 폼 표시
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  // 작성 중인 상품의 상태 - new(추가)이거나 상품의 id(수정)
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  // 현재 작성 중인 상품 정보
  const [productForm, setProductForm] = useState<IProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  // 상품 삭제
  const deleteProductItem = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 수정을 위한 함수
  const startEditProduct = (product: IProductWithUI) => {
    // 수정하려는 상품의 아이디 처리
    setEditingProduct(product.id);
    // 상품 폼에 수정하려는 상품 값 채움
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    // 상품 작성 폼 표시
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

      <ProductTable
        products={products}
        getRemainingStock={getRemainingStock}
        startEditProduct={startEditProduct}
        deleteProductItem={deleteProductItem}
      />

      {showProductForm && (
        <ProductForm
          setShowProductForm={setShowProductForm}
          addProduct={addProduct}
          updateProduct={updateProduct}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

export default ProductTab;
