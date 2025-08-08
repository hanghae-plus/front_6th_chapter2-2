// 쿠폰 관련 에러 클래스들
export class CouponError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CouponError";
  }
}

// 이미 존재하는 쿠폰 코드 에러
export class DuplicateCouponCodeError extends CouponError {
  constructor(code: string) {
    super(`이미 존재하는 쿠폰 코드입니다: ${code}`);
    this.name = "DuplicateCouponCodeError";
  }
}

// 쿠폰 사용 조건 미충족 에러
export class CouponUsageConditionError extends CouponError {
  constructor(discountType: "amount" | "percentage", minAmount: number) {
    const typeText = discountType === "percentage" ? "정률" : "정액";
    super(`${typeText} 쿠폰은 ${minAmount.toLocaleString()}원 이상 구매 시 사용 가능합니다.`);
    this.name = "CouponUsageConditionError";
  }
}

// 쿠폰을 찾을 수 없는 에러
export class CouponNotFoundError extends CouponError {
  constructor(code: string) {
    super(`쿠폰을 찾을 수 없습니다: ${code}`);
    this.name = "CouponNotFoundError";
  }
}

// 쿠폰 유효성 검증 에러
export class CouponValidationError extends CouponError {
  constructor(message: string) {
    super(`쿠폰 유효성 검증 실패: ${message}`);
    this.name = "CouponValidationError";
  }
}
