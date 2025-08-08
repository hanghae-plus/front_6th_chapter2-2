import { Product } from "../../types";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

// - removeProductDiscount: 할인 규칙 삭제
export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}
