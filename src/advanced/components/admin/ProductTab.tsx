import Button from '../ui/Button.tsx';
import ProductForm from './ProductForm.tsx';
import ProductTable from './ProductTable.tsx';
import { useProductForm } from '../../hooks/useProductForm.ts';
import { useSetAtom } from 'jotai/index';
import {
  deleteProductAtom,
  productAtom,
} from '../../store/entities/product.store.ts';
import { useAtomValue } from 'jotai';
import { cartAtom } from '../../store/entities/cart.store.ts';

const ProductTab = () => {
  const { state, handler, util } = useProductForm();
  const products = useAtomValue(productAtom);
  const cart = useAtomValue(cartAtom);
  const deleteProduct = useSetAtom(deleteProductAtom);
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button
            onClick={util.startNewAddProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <ProductTable
        products={products}
        cart={cart}
        deleteProduct={deleteProduct}
        startEditProduct={util.startEditProduct}
      />

      {state.showProductForm && (
        <ProductForm
          onComplete={util.onComplete}
          editingProduct={state.editingProduct}
          handler={handler}
        />
      )}
    </section>
  );
};

export default ProductTab;
