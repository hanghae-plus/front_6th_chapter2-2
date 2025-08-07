import { Dispatch, SetStateAction } from "react";
import { NewProductForm, ProductWithUI } from "../../../types/product";
import ProductForm from "./ProductForm";
import ProductHeader from "./ProductHeader";
import ProductTable from "./ProductTable";

interface IProductManagementTableProps {
  isAdmin: boolean;
  products: ProductWithUI[];
  setEditingProduct: Dispatch<SetStateAction<string | null>>;
  setProductForm: Dispatch<SetStateAction<NewProductForm>>;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
  editProductForm: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (product: NewProductForm) => void;
  updateProduct: (productId: string, product: NewProductForm) => void;
  clearProductForm: () => void;
  productForm: NewProductForm;
  editingProduct: string | null;
  showProductForm: boolean;
  getRemainingStock: (product: ProductWithUI) => number;
}

const ProductManager = ({
  isAdmin,
  products,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  editProductForm,
  deleteProduct,
  addProduct,
  updateProduct,
  clearProductForm,
  productForm,
  editingProduct,
  showProductForm,
  getRemainingStock,
}: IProductManagementTableProps) => {
  /** 상품 등록 */
  const handleProductSubmit = (e: React.FormEvent) => {
    // 이벤트 전파 방지
    e.preventDefault();

    // 수정 모드인지 확인
    const isEditMode = editingProduct && editingProduct !== "new";
    if (isEditMode) {
      // 수정 모드인 경우 상품 업데이트
      updateProduct(editingProduct, productForm);
    } else {
      // 새 상품 등록
      addProduct(productForm);
    }

    clearProductForm();
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {/* 헤더 섹션 */}
      <ProductHeader setEditingProduct={setEditingProduct} setProductForm={setProductForm} setShowProductForm={setShowProductForm} />

      {/* 상품 테이블 */}
      <ProductTable products={products} isAdmin={isAdmin} getRemainingStock={getRemainingStock} editProductForm={editProductForm} deleteProduct={deleteProduct} />

      {/* 상품 폼 섹션 */}
      {showProductForm && (
        <ProductForm
          productForm={productForm}
          editingProduct={editingProduct}
          handleProductSubmit={handleProductSubmit}
          setProductForm={setProductForm}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
        />
      )}
    </section>
  );
};

export default ProductManager;
