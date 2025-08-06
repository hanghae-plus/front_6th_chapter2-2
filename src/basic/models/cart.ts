// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
// 5. addItemToCart(cart, product): 상품 추가
// 6. removeItemFromCart(cart, productId): 상품 제거
// 7. getRemainingStock(product, cart): 남은 재고 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

// TODO: 구현

import type { CartItem, Product } from '../../types';
import { applyDiscount } from './discount';

interface GetMaxApplicableDiscountParams {
  item: CartItem;
  cart: CartItem[];
}

// 적용 가능한 최대 할인율 계산
export function getMaxApplicableDiscount({
  item,
  cart,
}: GetMaxApplicableDiscountParams) {
  return calculateTotalDiscount({
    discountAppliers: [
      createItemMaxDiscountApplier({ item }),
      createBulkPurchaseDiscountApplier({ cart }),
    ],
  });
}

interface CreateItemMaxDiscountApplierParams {
  item: CartItem;
}

// 개별 아이템의 할인율 계산
export function createItemMaxDiscountApplier({
  item,
}: CreateItemMaxDiscountApplierParams): DiscountApplier {
  return ({ baseDiscount }: { baseDiscount: number }) => {
    const { quantity, product } = item;
    const { discounts } = product;

    const discount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, baseDiscount);

    return baseDiscount + discount;
  };
}

interface CreateBulkPurchaseDiscountApplierParams {
  cart: CartItem[];
}

// 대량 구매 할인율 계산
export function createBulkPurchaseDiscountApplier({
  cart,
}: CreateBulkPurchaseDiscountApplierParams): DiscountApplier {
  return ({ baseDiscount }: { baseDiscount: number }) => {
    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);

    return hasBulkPurchase
      ? Math.min(baseDiscount + 0.05, 0.5) // 대량 구매 시 추가 5% 할인
      : baseDiscount;
  };
}

type DiscountApplier = ({ baseDiscount }: { baseDiscount: number }) => number;

interface ApplyDiscountsParams {
  baseDiscount?: number;
  discountAppliers: DiscountApplier[];
}

// 총 할인율 계산
export function calculateTotalDiscount({
  baseDiscount = 0,
  discountAppliers,
}: ApplyDiscountsParams) {
  return discountAppliers.reduce((acc, applyDiscount) => {
    return applyDiscount({ baseDiscount: acc });
  }, baseDiscount);
}

interface CalculateItemTotalParams {
  item: CartItem;
  cart: CartItem[];
}

// 개별 아이템의 할인 적용 후 총액 계산
export function calculateItemTotal({ item, cart }: CalculateItemTotalParams) {
  const { price } = item.product;
  const { quantity } = item;

  const discount = getMaxApplicableDiscount({ item, cart });

  return applyDiscount({ price: price * quantity, discount });
}

interface CalculateCartTotalParams {
  cart: CartItem[];
  applyCoupon: (params: { price: number }) => number;
}

// 장바구니 총액 계산 (할인 전/후, 할인액)
export function calculateCartTotal({
  cart,
  applyCoupon,
}: CalculateCartTotalParams) {
  const { totalBeforeDiscount, totalAfterDiscount } = cart.reduce(
    (acc, item) => {
      const { product, quantity } = item;

      const itemPrice = product.price * quantity;
      acc.totalBeforeDiscount += itemPrice;

      acc.totalAfterDiscount += calculateItemTotal({
        item,
        cart,
      });

      return acc;
    },
    {
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
    }
  );

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(applyCoupon({ price: totalAfterDiscount })),
  };
}

interface AddToCartParams {
  cart: CartItem[];
  product: Product;
  checkSoldOut: () => boolean;
  onFailure: (params: { message: string }) => void;
  onSuccess: () => void;
}

// 재고 확인 후 상품 추가
export function addToCart({
  cart,
  product,
  checkSoldOut,
  onFailure,
  onSuccess,
}: AddToCartParams) {
  if (checkSoldOut()) {
    onFailure({ message: '재고가 부족합니다!' });
    return cart;
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      onFailure({ message: `재고는 ${product.stock}개까지만 있습니다.` });
      return cart;
    }

    onSuccess();
    return updateCartItemQuantity({
      cart,
      productId: product.id,
      quantity: newQuantity,
    });
  }

  onSuccess();
  return addItemToCart({ cart, product });
}

interface AddItemToCartParams {
  cart: CartItem[];
  product: Product;
}

// 상품 추가
export function addItemToCart({ cart, product }: AddItemToCartParams) {
  return [...cart, { product, quantity: 1 }];
}

interface UpdateCartQuantityParams {
  cart: CartItem[];
  products: Product[];
  productId: string;
  newQuantity: number;
  onFailure: (params: { message: string }) => void;
  onSuccess: () => void;
}

export function updateCartQuantity({
  cart,
  products,
  productId,
  newQuantity,
  onFailure,
  onSuccess,
}: UpdateCartQuantityParams) {
  if (newQuantity <= 0) {
    onSuccess();
    return removeItemFromCart({ cart, productId });
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return cart;
  }

  const maxStock = product.stock;
  if (newQuantity > maxStock) {
    onFailure({ message: `재고는 ${maxStock}개까지만 있습니다.` });
    return cart;
  }

  onSuccess();
  return updateCartItemQuantity({
    cart,
    productId: productId,
    quantity: newQuantity,
  });
}

interface UpdateCartItemQuantityParams {
  cart: CartItem[];
  productId: string;
  quantity: number;
}

// 상품 수량 변경
export function updateCartItemQuantity({
  cart,
  productId,
  quantity,
}: UpdateCartItemQuantityParams) {
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: quantity } : item
  );
}

interface RemoveItemFromCartParams {
  cart: CartItem[];
  productId: string;
}

// 상품 제거
export function removeItemFromCart({
  cart,
  productId,
}: RemoveItemFromCartParams) {
  return cart.filter((item) => item.product.id !== productId);
}

interface CalculateTotalItemCount {
  cart: CartItem[];
}

// 장바구니 총 개수 계산
export function calculateTotalItemCount({ cart }: CalculateTotalItemCount) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
