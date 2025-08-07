import type { CartItem, Product } from '../../../types';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { useDebouncedSearch } from '../../hooks/useSearch';
import * as cartModel from '../../models/cart';
import * as productModel from '../../models/product';
import { CartPageUI } from './CartPageUI';
import { ProductCardContainer } from './products/ProductCardContainer';

export function CartPageContainer() {
  const cart = useCart();
  const products = useProducts();
  const searchTerm = useDebouncedSearch();

  // 데이터 가공 로직
  const filteredProducts = productModel.searchProducts({
    products,
    searchTerm,
  });

  // 장바구니 아이템 데이터 가공
  const cartItemsWithData = cart
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product.id);

      if (!product) {
        return null;
      }

      const discountRate = cartModel.calculateItemDiscountRate({
        item: cartItem,
        cart,
      });

      const itemTotal = cartModel.calculateItemTotal({
        item: cartItem,
        cart,
      });

      return {
        cartItem,
        discountRate,
        itemTotal,
      };
    })
    .filter(Boolean) as Array<{
    cartItem: CartItem;
    discountRate: number;
    itemTotal: number;
  }>;

  // ProductCard 렌더링 핸들러
  const handleProductCardRender = (product: Product) => {
    return <ProductCardContainer key={product.id} product={product} />;
  };

  return (
    <CartPageUI
      products={products}
      filteredProducts={filteredProducts}
      searchTerm={searchTerm}
      cart={cart}
      cartItemsWithData={cartItemsWithData}
      onProductCardRender={handleProductCardRender}
    />
  );
}
