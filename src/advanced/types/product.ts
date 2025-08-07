import { Product } from "../../types";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export type NewProductForm = Omit<ProductWithUI, "id"> & { id?: string };
