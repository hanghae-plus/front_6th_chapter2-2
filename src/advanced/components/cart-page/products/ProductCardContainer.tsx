import type { ProductWithUI } from '../../../../types';
import { useAddToCart, useCart } from '../../../hooks/cart';
import * as discountModel from '../../../models/discount';
import * as productModel from '../../../models/product';
import { formatNumberKRW, formatNumberRate } from '../../../utils/formatters';
import { ProductCardUI } from './ProductCardUI';

interface Props {
  product: ProductWithUI;
}

export function ProductCardContainer({ product }: Props) {
  const cart = useCart();
  const addToCart = useAddToCart();
  const { name, description, discounts, isRecommended = false } = product;

  // 데이터 가공
  const maxDiscountRate = discountModel.getMaxDiscountRate({ discounts });
  const remainingStock = productModel.getRemainingStock({
    product,
    cart,
  });

  // 재고 상태 계산
  const getStockStatus = (stock: number): 'sufficient' | 'low' | 'out' => {
    if (stock <= 0) return 'out';
    if (stock <= 5) return 'low';
    return 'sufficient';
  };

  // UI 컴포넌트에 전달할 데이터 준비
  const formattedPrice = productModel.formatPrice({
    cart,
    product,
    formatter: formatNumberKRW,
  });

  const formattedDiscountRate =
    discounts.length > 0
      ? formatNumberRate({ number: maxDiscountRate })
      : undefined;

  const stockStatus = getStockStatus(remainingStock);

  // 할인 정보 계산
  const discountInfo =
    discounts.length > 0
      ? {
          quantity: discounts[0].quantity,
          rate: discounts[0].rate * 100,
        }
      : null;

  return (
    <ProductCardUI
      name={name}
      description={description}
      price={formattedPrice}
      discountRate={formattedDiscountRate}
      discountInfo={discountInfo}
      isRecommended={isRecommended}
      stockStatus={stockStatus}
      remainingStock={remainingStock}
      onAddToCart={() => addToCart({ product })}
    />
  );
}
