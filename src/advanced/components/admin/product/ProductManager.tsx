import { useProduct } from "../../../hooks/useProduct";
import { useProductForm } from "../../../hooks/useProductForm";
import { useCart } from "../../../hooks/useCart";
import ProductForm from "./ProductForm";
import ProductHeader from "./ProductHeader";
import ProductTable from "./ProductTable";

const ProductManager = () => {
  /** 상품 관련 - useProduct hook 사용 */
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();

  /** 상품 폼 관련 - useProductForm hook 사용 */
  const { editingProduct, showProductForm, productForm, editProductForm, clearProductForm } = useProductForm();

  /** 장바구니 관련 - useCart hook 사용 */
  const { getRemainingStock } = useCart({ products });

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
      <ProductHeader />

      {/* 상품 테이블 */}
      <ProductTable products={products} getRemainingStock={getRemainingStock} editProductForm={editProductForm} deleteProduct={deleteProduct} />

      {/* 상품 폼 섹션 */}
      {showProductForm && <ProductForm handleProductSubmit={handleProductSubmit} />}
    </section>
  );
};

export default ProductManager;
