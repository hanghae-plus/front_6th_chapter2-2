import { useAtomValue } from "jotai";
import { productsAtom } from "../../../store/atoms/productAtoms";
import { filteredProductsAtom } from "../../../store/selectors/filteredProductsSelector";
import { getRemainingStockAtom } from "../../../store/selectors/getRemainingStockSelector";

/**
 * 쇼핑몰 페이지 상품 관련 모든 상태 캡슐화하는 커스텀 훅.
 */

export const useProduct = () => {
  const products = useAtomValue(productsAtom);
  const filteredProducts = useAtomValue(filteredProductsAtom);
  const getRemainingStock = useAtomValue(getRemainingStockAtom);

  // 컴포넌트에서 사용할 상태와 함수를 반환
  return {
    products,
    filteredProducts,
    getRemainingStock,
  };
};
