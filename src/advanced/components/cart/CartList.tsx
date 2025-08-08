import { CartItem, ProductWithUI } from '../../../types';
import { CartItemDiscount, CartItemPrice } from './';
import { UpdateQuantityResult } from '../../utils/cart';
import { QuantityButton, RemoveButton, QuantityDisplay } from '../../../shared/components';

interface CartListProps {
  cart: CartItem[];
  products: ProductWithUI[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => UpdateQuantityResult;
  onQuantityError: (message: string) => void;
}

export function CartList({ cart, onRemoveItem, onUpdateQuantity, onQuantityError }: CartListProps) {
  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {cart.map((item) => (
        <CartItemRow
          key={item.product.id}
          item={item}
          cart={cart}
          onRemoveItem={onRemoveItem}
          onUpdateQuantity={onUpdateQuantity}
          onQuantityError={onQuantityError}
        />
      ))}
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => UpdateQuantityResult;
  onQuantityError: (message: string) => void;
}

function CartItemRow({
  item,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onQuantityError,
}: CartItemRowProps) {
  const handleQuantityChange = (newQuantity: number) => {
    const result = onUpdateQuantity(item.product.id, newQuantity);
    handleQuantityError(result);
  };

  const handleQuantityError = (result: UpdateQuantityResult) => {
    if (!result.success) {
      const errorMessage = getErrorMessage(result);
      onQuantityError(errorMessage);
    }
  };

  const getErrorMessage = (result: UpdateQuantityResult): string => {
    if (result.success) {
      return '수량 업데이트에 실패했습니다.';
    }

    switch (result.reason) {
      case 'INSUFFICIENT_STOCK':
        return `재고는 ${result.maxStock}개까지만 있습니다.`;
      case 'PRODUCT_NOT_FOUND':
        return '상품을 찾을 수 없습니다.';
      default:
        return '수량 업데이트에 실패했습니다.';
    }
  };

  return (
    <div className="border-b pb-3 last:border-b-0">
      <CartItemHeader item={item} onRemoveItem={onRemoveItem} />
      <CartItemContent item={item} cart={cart} onQuantityChange={handleQuantityChange} />
    </div>
  );
}

// 카트 아이템 컨텐츠
interface CartItemContentProps {
  item: CartItem;
  cart: CartItem[];
  onQuantityChange: (newQuantity: number) => void;
}

function CartItemContent({ item, cart, onQuantityChange }: CartItemContentProps) {
  return (
    <div className="flex items-center justify-between">
      <QuantityControls quantity={item.quantity} onQuantityChange={onQuantityChange} />
      <CartItemInfo item={item} cart={cart} />
    </div>
  );
}

// 카트 아이템 헤더
interface CartItemHeaderProps {
  item: CartItem;
  onRemoveItem: (productId: string) => void;
}

function CartItemHeader({ item, onRemoveItem }: CartItemHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
      <RemoveButton onClick={() => onRemoveItem(item.product.id)} className="ml-2" />
    </div>
  );
}

// 수량 컨트롤
interface QuantityControlsProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

function QuantityControls({ quantity, onQuantityChange }: QuantityControlsProps) {
  return (
    <div className="flex items-center">
      <QuantityButton type="decrease" onClick={() => onQuantityChange(quantity - 1)} />
      <QuantityDisplay quantity={quantity} />
      <QuantityButton type="increase" onClick={() => onQuantityChange(quantity + 1)} />
    </div>
  );
}

// 카트 아이템 정보
interface CartItemInfoProps {
  item: CartItem;
  cart: CartItem[];
}

function CartItemInfo({ item, cart }: CartItemInfoProps) {
  return (
    <div className="text-right">
      <CartItemDiscount item={item} cart={cart} />
      <CartItemPrice item={item} cart={cart} />
    </div>
  );
}
