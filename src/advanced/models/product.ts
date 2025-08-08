import type { CartItem, Product, ProductWithUI } from '../../types';

interface GetRemainingStockParams {
  cart: CartItem[];
  product: Product;
}

// 재고 수량 조회
export function getRemainingStock({ cart, product }: GetRemainingStockParams) {
  const cartItemQuantity =
    cart.find((item) => item.product.id === product.id)?.quantity ?? 0;

  return Math.max(product.stock - cartItemQuantity, 0);
}

interface IsSoldOutParams {
  remainingStock: number;
}

// 매진 확인
export function isSoldOut({ remainingStock }: IsSoldOutParams) {
  return remainingStock === 0;
}

interface FormatPriceParams {
  cart: CartItem[];
  product: Product;
  formatter: (params: { number: number }) => string;
}

// 상품 가격 포맷팅
export function formatPrice({ cart, product, formatter }: FormatPriceParams) {
  const remainingStock = getRemainingStock({ cart, product });
  const soldOut = isSoldOut({ remainingStock });

  return soldOut ? 'SOLD OUT' : formatter({ number: product.price });
}

interface AddProductParams {
  newProduct: ProductWithUI;
  products: ProductWithUI[];
}

// 상품 추가
export function addProduct({ newProduct, products }: AddProductParams) {
  return [...products, newProduct];
}

interface UpdateProductParams {
  productId: string;
  updates: Partial<ProductWithUI>;
  products: ProductWithUI[];
}

// 상품 수정
export function updateProduct({
  productId,
  updates,
  products,
}: UpdateProductParams) {
  return products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
}

interface DeleteProductParams {
  productId: string;
  products: ProductWithUI[];
}

// 상품 삭제
export function deleteProduct({ productId, products }: DeleteProductParams) {
  return products.filter((product) => product.id !== productId);
}

interface SearchProductsParams {
  searchTerm: string;
  products: ProductWithUI[];
}

// 상품 검색
export function searchProducts({ searchTerm, products }: SearchProductsParams) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return searchTerm
    ? products.filter((product) => {
        const includesName = product.name
          .toLowerCase()
          .includes(lowerCaseSearchTerm);
        const includesDescription =
          product.description &&
          product.description.toLowerCase().includes(lowerCaseSearchTerm);

        return includesName || includesDescription;
      })
    : products;
}
