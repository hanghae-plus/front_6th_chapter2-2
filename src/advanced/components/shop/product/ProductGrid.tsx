import { formatters, getRemainingStock } from '../../../utils/formatters.ts';

import { useAtomValue } from 'jotai/index';
import { cartAtom } from '../../../store/entities/cart.store.ts';
import { filterProductAtom } from '../../../store/entities/product.store.ts';
import ProductItem from './ProductItem.tsx';

const ProductGrid = () => {
  const cart = useAtomValue(cartAtom);
  const filteredProducts = useAtomValue(filterProductAtom);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map(product => {
        const cartItem = cart.find(item => item.product.id === product.id);
        const remainingStock = getRemainingStock(product, cartItem?.quantity);
        const displayPrice =
          remainingStock <= 0 ? 'SOLD OUT' : formatters(product.price);

        return (
          <ProductItem
            key={product.id}
            product={product}
            displayPrice={displayPrice}
            remainingStock={remainingStock}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
