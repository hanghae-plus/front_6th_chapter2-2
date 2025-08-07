import { useAtom } from 'jotai';
import { useProductForm } from '../hooks/useProductForm';
import { useProduct } from '../hooks/useProduct';
import { Button } from '@/ui';
import { initialProductFormData } from '../constants/product';
import { AdminProductTable } from './AdminProductTable';
import { AdminProductForm } from './AdminProductForm';
import { productsAtom, cartAtom } from '../../../atoms';
import { useNotification } from '../../../hooks';

export const AdminProduct = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const [cart] = useAtom(cartAtom);
  const { addNotification } = useNotification();

  const { updateProduct, addProduct, deleteProduct } = useProduct({
    setProducts,
    addNotification,
  });
  const {
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    handleProductSubmit,
    startEditProduct,
  } = useProductForm(addProduct, updateProduct);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button
            onClick={() => {
              setEditingProduct('new');
              setProductForm(initialProductFormData);
              setShowProductForm(true);
            }}
            variant="primary"
            size="sm"
          >
            새 상품 추가
          </Button>
        </div>
      </div>
      <AdminProductTable
        products={products}
        cart={cart}
        isAdmin={true}
        deleteProduct={deleteProduct}
        startEditProduct={startEditProduct}
      />

      {showProductForm && (
        <AdminProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          handleProductSubmit={handleProductSubmit}
          setEditingProduct={setEditingProduct}
          addNotification={addNotification}
          setShowProductForm={setShowProductForm}
        />
      )}
    </section>
  );
};
