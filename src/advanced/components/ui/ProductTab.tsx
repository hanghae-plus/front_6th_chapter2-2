import { ProductAccordion } from './ProductAccordion';
import { ProductForm } from './ProductForm';
import type { ProductWithUI } from '../../constants';
import { useProductForm } from '../../hooks/useProductForm';

interface ProductTabProps {
  products: ProductWithUI[];
  onAddProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  onUpdateProduct: (productId: string, product: Omit<ProductWithUI, 'id'>) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductTab({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductTabProps) {
  const {
    showProductForm,
    editingProduct,
    productFormData,
    updateProductFormData,
    startEditProduct,
    handleProductSubmit,
    handleShowProductForm,
    handleCancelProductForm,
  } = useProductForm({
    onAddProduct,
    onUpdateProduct,
  });

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <button
            onClick={handleShowProductForm}
            className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductAccordion products={products} onEdit={startEditProduct} onDelete={onDeleteProduct} />

      <ProductForm
        isOpen={showProductForm}
        editingProduct={editingProduct}
        form={productFormData}
        updateForm={updateProductFormData}
        onSubmit={handleProductSubmit}
        onCancel={handleCancelProductForm}
      />
    </section>
  );
}
