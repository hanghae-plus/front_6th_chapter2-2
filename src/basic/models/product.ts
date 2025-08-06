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
