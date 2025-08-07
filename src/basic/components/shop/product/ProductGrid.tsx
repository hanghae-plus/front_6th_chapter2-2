import { formatters, getRemainingStock } from '../../../utils/formatters.ts';

import { CartItem, Product, ProductWithUI } from '../../../models/entities';
import ProductItem from './ProductItem.tsx';
interface ProductGridProps {
  filteredProducts: ProductWithUI[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
}

const ProductGrid = ({
  filteredProducts,
  cart,
  addToCart,
}: ProductGridProps) => {
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
            addToCart={addToCart}
            remainingStock={remainingStock}
            displayPrice={displayPrice}
          />
        );
      })}
    </div>
  );
};
export default ProductGrid;
