import { Product, ProductsActions, SOLD_OUT } from '../../../shared/types';
import { formatAdminPrice, getRemainingStock } from '../../../shared/utils';
import { ProductItem } from './ProductItem';

export const ProductList = ({
  productsActions,
  startEditProduct,
}: {
  productsActions: ProductsActions;
  startEditProduct: (product: Product) => void;
}) => {
  const { products, getProduct, deleteProduct } = productsActions;

  const formatPrice = (price: number, productId?: string): string => {
    const product = productId ? getProduct(productId) : undefined;
    return product && getRemainingStock(product.stock) <= 0
      ? SOLD_OUT
      : formatAdminPrice(price);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상품명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              가격
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              재고
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              설명
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              formatPrice={formatPrice}
              startEditProduct={startEditProduct}
              deleteProduct={deleteProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
