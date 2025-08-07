import { useAtomValue, useSetAtom } from "jotai";

import productsAtom from "@/advanced/features/product/atoms/products.atom";

export function useProducts() {
  const products = useAtomValue(productsAtom.products);
  const addProduct = useSetAtom(productsAtom.addProduct);
  const updateProduct = useSetAtom(productsAtom.updateProduct);
  const deleteProduct = useSetAtom(productsAtom.deleteProduct);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
