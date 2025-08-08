import { AlreadyExistsCouponCodeError } from "../../__models/coupon/error";

export const isAlreadyExistsCouponCodeError = (
  error: unknown
): error is AlreadyExistsCouponCodeError => {
  return error instanceof AlreadyExistsCouponCodeError;
};
