export type TActiveTab = "products" | "coupons";

export const ADMIN_TABS: { label: string; value: TActiveTab }[] = [
  {
    label: "상품 관리",
    value: "products",
  },
  {
    label: "쿠폰 관리",
    value: "coupons",
  },
];
