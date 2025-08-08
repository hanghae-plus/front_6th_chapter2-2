import { ProductWithUI } from '../../types';
import Product from '../components/Product';

type TProductListProps = {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI, onSuccess?: () => void) => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
  getRemainingStock: (product: ProductWithUI) => number;
};

export default function ProductList(props: TProductListProps) {
  const { products, debouncedSearchTerm, addToCart, addNotification, getRemainingStock } = props;

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }

    return `₩${price.toLocaleString()}`;
  };

  const handleAddToCart = (product: ProductWithUI) => {
    try {
      addToCart(product, () => {
        addNotification('장바구니에 담았습니다', 'success');
      });
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        'error',
      );
    }
  };

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
      )
    : products;

  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
        <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredProducts.map((product) => {
            const remainingStock = getRemainingStock(product);
            const price = formatPrice(product.price, product.id);

            return (
              <Product
                key={product.id}
                product={product}
                price={price}
                remainingStock={remainingStock}
                handleAddToCart={handleAddToCart}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
