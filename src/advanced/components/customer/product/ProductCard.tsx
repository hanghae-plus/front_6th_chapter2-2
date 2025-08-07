import { useAtom } from "jotai";
import { isAdminAtom } from "../../../atoms/adminAtoms";
import { useProduct } from "../../../hooks/useProduct";
import { useCart } from "../../../hooks/useCart";
import { ProductWithUI } from "../../../types/product";
import { formatPrice } from "../../../utils/productUtils";
import { ImageIcon } from "../../elements/Icons";

interface ProductCardProps {
  product: ProductWithUI;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  /** 관리자 모드 여부 - Jotai 사용 */
  const [isAdmin] = useAtom(isAdminAtom);

  /** 상품 데이터 - useProduct hook 사용 */
  const { products } = useProduct();

  /** 장바구니 관련 actions - useCart hook 사용 */
  const { addToCart, getRemainingStock } = useCart({ products });

  /** 재고 확인 */
  const remainingStock = getRemainingStock(product);

  /** 가격 포맷팅 */
  const formattedPrice = formatPrice(product.price, isAdmin, {
    productId: product.id,
    products,
    getRemainingStock,
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <ImageIcon />
        </div>
        {product.isRecommended && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">BEST</span>}
        {product.discounts.length > 0 && <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%</span>}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">{formattedPrice}</p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>}
          {remainingStock > 5 && <p className="text-xs text-gray-500">재고 {remainingStock}개</p>}
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={() => addToCart(product)}
          disabled={remainingStock <= 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${remainingStock <= 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-800"}`}
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </button>
      </div>
    </div>
  );
};
