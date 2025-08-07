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
  getRemainingStock: () => number;
}

// 매진 확인
export function isSoldOut({ getRemainingStock }: IsSoldOutParams) {
  return getRemainingStock() === 0;
}

interface FormatPriceParams {
  cart: CartItem[];
  product: Product;
  formatter: (params: { number: number }) => string;
}

// 상품 가격 포맷팅
export function formatPrice({ cart, product, formatter }: FormatPriceParams) {
  const soldOut = isSoldOut({
    getRemainingStock: () => getRemainingStock({ cart, product }),
  });

  return soldOut ? 'SOLD OUT' : formatter({ number: product.price });
}

interface AddProductParams {
  id: string;
  newProduct: Omit<ProductWithUI, 'id'>;
  products: ProductWithUI[];
  onSuccess: () => void;
}

// 상품 추가
export function addProduct({
  id,
  newProduct,
  products,
  onSuccess,
}: AddProductParams) {
  onSuccess();
  return [
    ...products,
    {
      ...newProduct,
      id,
    },
  ];
}

interface UpdateProductParams {
  productId: string;
  updates: Partial<ProductWithUI>;
  products: ProductWithUI[];
  onSuccess: () => void;
}

// 상품 수정
export function updateProduct({
  productId,
  updates,
  products,
  onSuccess,
}: UpdateProductParams) {
  onSuccess();
  return products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
}

interface DeleteProductParams {
  productId: string;
  products: ProductWithUI[];
  onSuccess: () => void;
}

// 상품 삭제
export function deleteProduct({
  productId,
  products,
  onSuccess,
}: DeleteProductParams) {
  onSuccess();
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
