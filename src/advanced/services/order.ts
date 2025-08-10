import { CartItem } from "../../types";
import cartModel from "../models/cart";
import orderModel from "../models/order";

export type OrderOperationResult =
  | {
      orderNumber: string;
      message: string;
      status: "success";
    }
  | {
      message: string;
      status: "error";
    };

const orderService = {
  completeOrder: ({ cart }: { cart: CartItem[] }): OrderOperationResult => {
    if (cartModel.isEmpty(cart)) {
      return {
        message: "장바구니가 비어있습니다.",
        status: "error",
      };
    }

    const orderNumber = orderModel.generateOrderNumber();

    return {
      orderNumber,
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      status: "success",
    };
  },
};

export default orderService;
