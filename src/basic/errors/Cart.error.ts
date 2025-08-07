// 장바구니 관련 에러 클래스들
export class CartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartError";
  }
}

// 재고 부족 에러
export class InsufficientStockError extends CartError {
  constructor(productName: string, availableStock: number) {
    super(`${productName}의 재고가 부족합니다. (가용 재고: ${availableStock}개)`);
    this.name = "InsufficientStockError";
  }
}

// 재고 초과 에러
export class StockExceededError extends CartError {
  constructor(productName: string, maxStock: number, requestedQuantity: number) {
    super(`${productName}의 재고는 ${maxStock}개까지만 있습니다. (요청 수량: ${requestedQuantity}개)`);
    this.name = "StockExceededError";
  }
}

// 장바구니가 비어있는 에러
export class EmptyCartError extends CartError {
  constructor() {
    super("장바구니가 비어있습니다.");
    this.name = "EmptyCartError";
  }
}

// 수량 유효성 검증 에러
export class InvalidQuantityError extends CartError {
  constructor(quantity: number) {
    super(`유효하지 않은 수량입니다: ${quantity} (1 이상이어야 합니다)`);
    this.name = "InvalidQuantityError";
  }
}
