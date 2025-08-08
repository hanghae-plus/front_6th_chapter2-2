import { TabTitle } from '../../ui/TabTitle';
import { useProductsForm } from './hooks/useProductsForm';
import { ProductsFormContainer } from './ProductsFormContainer';
import { ProductsTableContainer } from './ProductsTableContainer';
import { Button } from './ui/Button';

export function ProductsTab() {
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
  } = useProductsForm();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <TabTitle>상품 목록</TabTitle>

          <Button onClick={openProductForm}>새 상품 추가</Button>
        </div>
      </div>

      <ProductsTableContainer startEditProduct={editProductForm} />

      {showProductForm && (
        <ProductsFormContainer
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
