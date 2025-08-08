import { atom } from "jotai";

export const isAdminAtom = atom(false);

export const showCouponFormAtom = atom(false);

export const showProductFormAtom = atom(false);

export const searchTermAtom = atom("");

export const editingProductAtom = atom(null);

export const productFormAtom = atom({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [] as Array<{ quantity: number; rate: number }>,
});

export const couponFormAtom = atom({
  name: "",
  code: "",
  discountType: "amount" as "amount" | "percentage",
  discountValue: 0,
});

export const totalItemCountAtom = atom(0);

export const selectedCouponAtom = atom(null);
