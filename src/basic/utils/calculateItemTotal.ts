import { CartItem } from "../../types";
import { getMaxApplicableDiscount } from "./getMaxApplicableDiscount";

export const calculateItemTotal = (item: CartItem, cart: CartItem[]) => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};
