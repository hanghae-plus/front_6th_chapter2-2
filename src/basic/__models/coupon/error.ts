import { CouponMessage } from "./constant";

class AlreadyExistsCouponCodeError extends Error {
  constructor() {
    super(CouponMessage.ALREADY_EXISTS_COUPON_CODE);
    this.name = "AlreadyExistsCouponCodeError";
  }
}

export { AlreadyExistsCouponCodeError };
