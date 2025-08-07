import type { ProductWithUI } from '../../../../types';
import { TabTitle } from '../ui/TabTitle';
import { useProductsForm } from './hooks/useProductsForm';
import { ProductsForm } from './ProductsForm';
import { ProductsTable } from './ProductsTable';
import { Button } from './ui/Button';

interface Props {
  products: ProductWithUI[];
  addProduct: (params: { newProduct: Omit<ProductWithUI, 'id'> }) => void;
  deleteProduct: (params: { productId: string }) => void;
  updateProduct: (params: {
    productId: string;
    updates: Partial<ProductWithUI>;
  }) => void;
}

export function ProductsTab({
  products,
  addProduct,
  deleteProduct,
  updateProduct,
}: Props) {
  const {
    showProductForm,
    editingProduct,
    productForm,
    closeProductForm,
    openProductForm,
    editProductForm,
    handleSubmitProductForm,
    handleNameChange,
    handleDescriptionChange,
    handlePriceChange,
    handlePriceBlur,
    handleStockChange,
    handleStockBlur,
    handleDiscountQuantityChange,
    handleDiscountRateChange,
    handleRemoveDiscount,
    handleAddDiscount,
    getDisplayValue,
    getDiscountRateDisplay,
  } = useProductsForm({ addProduct, updateProduct });

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <TabTitle>상품 목록</TabTitle>

          <Button onClick={openProductForm}>새 상품 추가</Button>
        </div>
      </div>

      <ProductsTable
        products={products}
        startEditProduct={editProductForm}
        deleteProduct={deleteProduct}
      />

      {showProductForm && (
        <ProductsForm
          onSubmit={handleSubmitProductForm}
          editingProduct={editingProduct}
          productForm={productForm}
          onClickCancel={closeProductForm}
          handleNameChange={handleNameChange}
          handleDescriptionChange={handleDescriptionChange}
          handlePriceChange={handlePriceChange}
          handlePriceBlur={handlePriceBlur}
          handleStockChange={handleStockChange}
          handleStockBlur={handleStockBlur}
          handleDiscountQuantityChange={handleDiscountQuantityChange}
          handleDiscountRateChange={handleDiscountRateChange}
          handleRemoveDiscount={handleRemoveDiscount}
          handleAddDiscount={handleAddDiscount}
          getDisplayValue={getDisplayValue}
          getDiscountRateDisplay={getDiscountRateDisplay}
        />
      )}
    </section>
  );
}
