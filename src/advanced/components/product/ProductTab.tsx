import { useState, useCallback } from "react";
import { IProductForm, IProductWithUI } from "../../type";
import { MESSAGES } from "../../constants/messages";
import { useProducts } from "../../hooks/useProducts";
import { useNotification } from "../../hooks/useNotification";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

const ProductTab = () => {
  const { products, deleteProduct } = useProducts();
  const { addNotification } = useNotification();

  // 상품 추가 (수정) 폼 표시
  const [showProductForm, setShowProductForm] = useState(false);

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

  // 새 상품 추가 함수
  const handleAddProduct = () => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(true);
  };

  // 상품 삭제
  const deleteProductItem = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification(MESSAGES.PRODUCT.DELETED, "success");
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
            onClick={handleAddProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        startEditProduct={startEditProduct}
        deleteProductItem={deleteProductItem}
      />

      {showProductForm && (
        <ProductForm
          setShowProductForm={setShowProductForm}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
        />
      )}
    </section>
  );
};

export default ProductTab;
