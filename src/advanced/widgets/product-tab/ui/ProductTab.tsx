import { ProductAccordion } from './ProductAccordion';
import { ProductForm } from './ProductForm';
import { useProductForm, useProductService } from '../../../features/product-management';

export function ProductTab() {
  const { onAddProduct, onUpdateProduct, onDeleteProduct } = useProductService();

  const {
    showProductForm,
    editingProduct,
    productFormData,
    updateProductFormData,
    startEditProduct,
    handleShowProductForm,
    handleCancelProductForm,
  } = useProductForm();

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      onUpdateProduct(editingProduct, productFormData);
    } else {
      onAddProduct(productFormData);
    }

    handleCancelProductForm();
  };

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

      <ProductAccordion onEdit={startEditProduct} onDelete={onDeleteProduct} />

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
