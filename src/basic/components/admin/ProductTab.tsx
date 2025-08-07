import Button from '../ui/Button.tsx';

import { CartItem, ProductWithUI } from '../../models/entities';

import ProductForm from './ProductForm.tsx';
import ProductTable from './ProductTable.tsx';
import { useProductForm } from '../../hooks/useProductForm.ts';
import { NotificationHandler } from '../../models/components/toast.types.ts';

interface ProductTabProps {
  cart: CartItem[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  addNotification: NotificationHandler;
  products: ProductWithUI[];
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

export interface FormType {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}
const ProductTab = ({
  products,
  cart,
  updateProduct,
  deleteProduct,
  addProduct,
  addNotification,
}: ProductTabProps) => {
  const { state, handler, util } = useProductForm({
    updateProduct,
    addNotification,
    addProduct,
  });
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
          updateProduct={updateProduct}
          addProduct={addProduct}
          addNotification={addNotification}
          productForm={state.productForm}
        />
      )}
    </section>
  );
};

export default ProductTab;
