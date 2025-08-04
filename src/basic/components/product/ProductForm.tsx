// components/ProductForm.tsx
import React, { FC, useState } from "react";
import { isValidPrice, isValidStock } from "../../utils/validators";
import { Product } from "../../../types";

// props 타입 정의
interface ProductFormProps {
  onAddProduct: (product: Omit<Product, "id">) => void;
}

export const ProductForm: FC<ProductFormProps> = ({ onAddProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !isValidPrice(price) || !isValidStock(stock)) {
      alert("상품 정보를 올바르게 입력해주세요.");
      return;
    }
    onAddProduct({
      name,
      price,
      stock,
      discounts: [],
    });
    setName("");
    setPrice(0);
    setStock(0);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
      <h4 className="text-lg font-bold mb-4">상품 추가</h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="상품명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="가격"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="재고"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          상품 추가
        </button>
      </div>
    </form>
  );
};
