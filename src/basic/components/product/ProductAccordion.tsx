// components/ProductAccordion.tsx
import React, { useState } from "react";
import { Discount, Product } from "../../../types";
import { isValidStock } from "../../utils/validators";
import { formatPrice } from "../../utils/formatters";
import { Icons } from "../icons";

// props 타입 정의
interface ProductAccordionProps {
  product: Product;
  onUpdate: (productId: string, updates: Partial<Product>) => void;
  onRemove: (productId: string) => void;
  onAddDiscount: (productId: string, discount: Discount) => void;
  onRemoveDiscount: (productId: string, discountIdx: number) => void;
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
  onUpdate,
  onRemove,
  onAddDiscount,
  onRemoveDiscount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newDiscountQuantity, setNewDiscountQuantity] = useState(0);
  const [newDiscountRate, setNewDiscountRate] = useState(0);

  const handleUpdateStock = (newStock: number) => {
    if (isValidStock(newStock)) {
      onUpdate(product.id, { stock: newStock });
    } else {
      alert("재고는 0 이상의 정수여야 합니다.");
    }
  };

  const handleAddDiscount = () => {
    if (newDiscountQuantity > 0 && newDiscountRate > 0) {
      onAddDiscount(product.id, {
        quantity: newDiscountQuantity,
        rate: newDiscountRate / 100,
      });
      setNewDiscountQuantity(0);
      setNewDiscountRate(0);
    } else {
      alert("할인 수량과 비율을 올바르게 입력해주세요.");
    }
  };

  return (
    <div className="border rounded-lg">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">
          {product.name} ({formatPrice(product.price)})
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">재고: {product.stock}개</span>
          {isOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
        </div>
      </div>
      {isOpen && (
        <div className="p-4 border-t space-y-4 bg-white">
          <div>
            <h5 className="font-semibold mb-2">재고 관리</h5>
            <div className="flex space-x-2">
              <input
                type="number"
                value={product.stock}
                onChange={(e) => handleUpdateStock(Number(e.target.value))}
                className="w-24 p-2 border rounded"
              />
              <button
                onClick={() => onRemove(product.id)}
                className="p-2 bg-red-500 text-white rounded flex items-center"
              >
                <Icons.Trash />
                <span className="ml-1">삭제</span>
              </button>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-2">수량별 할인 관리</h5>
            <div className="space-y-2">
              {product.discounts.map((discount, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm">
                  <span className="flex-1">
                    {discount.quantity}개 이상 구매 시{" "}
                    {(discount.rate * 100).toFixed(0)}% 할인
                  </span>
                  <button
                    onClick={() => onRemoveDiscount(product.id, idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-2">
              <input
                type="number"
                placeholder="수량"
                value={newDiscountQuantity}
                onChange={(e) => setNewDiscountQuantity(Number(e.target.value))}
                className="w-20 p-1 border rounded text-sm"
              />
              <input
                type="number"
                placeholder="할인율 (%)"
                value={newDiscountRate}
                onChange={(e) => setNewDiscountRate(Number(e.target.value))}
                className="w-24 p-1 border rounded text-sm"
              />
              <button
                onClick={handleAddDiscount}
                className="p-1 px-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
