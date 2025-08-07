import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { INITIAL_PRODUCT_FORM } from "../../../utils/productUtils";
import { editingProductAtom, productFormAtom, showProductFormAtom } from "../../../atoms/productAtoms";

const ProductHeader = () => {
  const setEditingProduct = useSetAtom(editingProductAtom);
  const setProductForm = useSetAtom(productFormAtom);
  const setShowProductForm = useSetAtom(showProductFormAtom);

  /** 새 상품 추가  */
  const handleAddNewProduct = useCallback(() => {
    setEditingProduct("new");
    setProductForm(INITIAL_PRODUCT_FORM);
    setShowProductForm(true);
  }, [setEditingProduct, setProductForm, setShowProductForm]);

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">상품 목록</h2>
        <button onClick={handleAddNewProduct} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
          새 상품 추가
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;
