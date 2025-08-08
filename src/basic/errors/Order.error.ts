// 주문 관련 에러 클래스들
export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

// 주문 금액 부족 에러
export class InsufficientOrderAmountError extends OrderError {
  constructor(minAmount: number, currentAmount: number) {
    super(
      `주문 금액이 부족합니다. 최소 ${minAmount.toLocaleString()}원 이상 필요합니다. (현재: ${currentAmount.toLocaleString()}원)`
    );
    this.name = "InsufficientOrderAmountError";
  }
}

// 주문 상품 없음 에러
export class EmptyOrderError extends OrderError {
  constructor() {
    super("주문할 상품이 없습니다.");
    this.name = "EmptyOrderError";
  }
}

// 주문 처리 실패 에러
export class OrderProcessingError extends OrderError {
  constructor(reason: string) {
    super(`주문 처리 중 오류가 발생했습니다: ${reason}`);
    this.name = "OrderProcessingError";
  }
}

// 주문 번호 생성 실패 에러
export class OrderNumberGenerationError extends OrderError {
  constructor() {
    super("주문 번호 생성에 실패했습니다.");
    this.name = "OrderNumberGenerationError";
  }
}

// 주문 완료 실패 에러
export class OrderCompletionError extends OrderError {
  constructor(reason: string) {
    super(`주문 완료 처리 중 오류가 발생했습니다: ${reason}`);
    this.name = "OrderCompletionError";
  }
}

// 주문 검증 에러
export class OrderValidationError extends OrderError {
  constructor(message: string) {
    super(`주문 유효성 검증 실패: ${message}`);
    this.name = "OrderValidationError";
  }
}
