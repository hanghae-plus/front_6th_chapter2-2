// 상품 관련 에러 클래스들
export class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductError";
  }
}

// 상품을 찾을 수 없는 에러
export class ProductNotFoundError extends ProductError {
  constructor(productId: string) {
    super(`상품을 찾을 수 없습니다: ${productId}`);
    this.name = "ProductNotFoundError";
  }
}

// 상품 유효성 검증 에러
export class ProductValidationError extends ProductError {
  constructor(message: string) {
    super(`상품 유효성 검증 실패: ${message}`);
    this.name = "ProductValidationError";
  }
}

// 상품 가격 에러
export class ProductPriceError extends ProductError {
  constructor(price: number) {
    super(`유효하지 않은 상품 가격입니다: ${price}원 (0원 이상이어야 합니다)`);
    this.name = "ProductPriceError";
  }
}

// 상품 재고 에러
export class ProductStockError extends ProductError {
  constructor(stock: number) {
    super(`유효하지 않은 상품 재고입니다: ${stock}개 (0개 이상이어야 합니다)`);
    this.name = "ProductStockError";
  }
}

// 상품명 중복 에러
export class DuplicateProductNameError extends ProductError {
  constructor(name: string) {
    super(`이미 존재하는 상품명입니다: ${name}`);
    this.name = "DuplicateProductNameError";
  }
}

// 상품 설명 길이 에러
export class ProductDescriptionError extends ProductError {
  constructor(maxLength: number) {
    super(`상품 설명이 너무 깁니다. 최대 ${maxLength}자까지 입력 가능합니다.`);
    this.name = "ProductDescriptionError";
  }
}
