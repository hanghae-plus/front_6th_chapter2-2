import type { ProductWithUI } from '../../../../types';
import { useCart } from '../../../hooks/cart';
import { useDeleteProduct, useProducts } from '../../../hooks/product';
import * as productModel from '../../../models/product';
import { formatNumberWon } from '../../../utils/formatters';
import { ProductsTableUI } from './ProductsTableUI';

interface Props {
  startEditProduct: (params: { product: ProductWithUI }) => void;
}

export function ProductsTableContainer({ startEditProduct }: Props) {
  const cart = useCart();
  const products = useProducts();
  const deleteProduct = useDeleteProduct();

  // 데이터 가공 로직
  const getFormattedPrice = (product: ProductWithUI) => {
    return productModel.formatPrice({
      cart,
      product,
      formatter: formatNumberWon,
    });
  };

  const getStockVariant = (stock: number): 'stock' | 'yellow' | 'error' => {
    if (stock > 10) return 'stock';
    if (stock > 0) return 'yellow';
    return 'error';
  };

  const getDescription = (description?: string) => {
    return description || '-';
  };

  // 이벤트 핸들러
  const handleEditProduct = (product: ProductWithUI) => {
    startEditProduct({ product });
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct({ productId });
  };

  // UI 컴포넌트에 전달할 데이터 준비
  const processedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    formattedPrice: getFormattedPrice(product),
    stock: product.stock,
    stockVariant: getStockVariant(product.stock),
    description: getDescription(product.description),
    originalProduct: product, // 원본 데이터 보존
  }));

  return (
    <ProductsTableUI
      products={processedProducts}
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
    />
  );
}
