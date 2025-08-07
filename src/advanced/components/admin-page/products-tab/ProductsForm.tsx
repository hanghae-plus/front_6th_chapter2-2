import type { FormEvent } from 'react';
import { ProductsFormUI } from './ProductsFormUI';

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: { quantity: number; rate: number }[];
}

interface Props {
  onSubmit: (e: FormEvent) => void;
  editingProduct: string | null;
  productForm: ProductForm;
  onClickCancel: () => void;
  // 훅에서 제공하는 핸들러들
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStockChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStockBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountQuantityChange: ({
    index,
  }: {
    index: number;
  }) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountRateChange: ({
    index,
  }: {
    index: number;
  }) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveDiscount: ({ index }: { index: number }) => () => void;
  handleAddDiscount: () => void;
  getDisplayValue: ({ value }: { value: number }) => string;
  getDiscountRateDisplay: ({ rate }: { rate: number }) => number;
}

export function ProductsForm({
  onSubmit,
  editingProduct,
  productForm,
  onClickCancel,
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
}: Props) {
  const { name, description, price, stock, discounts } = productForm;

  // UI 컴포넌트에 전달할 데이터 준비
  const title = editingProduct === 'new' ? '새 상품 추가' : '상품 수정';
  const formattedPrice = getDisplayValue({ value: price });
  const formattedStock = getDisplayValue({ value: stock });

  // 할인 데이터 준비
  const discountItems = discounts.map((discount, index) => ({
    quantity: discount.quantity.toString(),
    rate: getDiscountRateDisplay({ rate: discount.rate }).toString(),
    onQuantityChange: handleDiscountQuantityChange({ index }),
    onRateChange: handleDiscountRateChange({ index }),
    onRemove: handleRemoveDiscount({ index }),
  }));

  return (
    <ProductsFormUI
      title={title}
      name={name}
      description={description}
      price={formattedPrice}
      stock={formattedStock}
      discounts={discountItems}
      onNameChange={handleNameChange}
      onDescriptionChange={handleDescriptionChange}
      onPriceChange={handlePriceChange}
      onPriceBlur={handlePriceBlur}
      onStockChange={handleStockChange}
      onStockBlur={handleStockBlur}
      onAddDiscount={handleAddDiscount}
      onSubmit={onSubmit}
      onCancel={onClickCancel}
    />
  );
}
