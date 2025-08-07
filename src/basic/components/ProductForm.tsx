// src/basic/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { validateNumberInput } from '../utils/validators';

interface Props {
  editingProduct: (Omit<Product, 'id'> & { id?: string }) | null;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onCancel: () => void;
}

export const ProductForm = ({ editingProduct, onAddProduct, onUpdateProduct, onCancel }: Props) => {
  const [productForm, setProductForm] = useState<
    Omit<Product, 'id'> & { id?: string }
  >({ name: '', price: 0, stock: 0, description: '', discounts: [] });

  useEffect(() => {
    if (editingProduct) {
      setProductForm(editingProduct);
    } else {
      setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    }
  }, [editingProduct]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = validateNumberInput(value);
    if (value === numericValue) {
      setProductForm({ ...productForm, price: Number(numericValue) });
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = validateNumberInput(value);
    setProductForm({ ...productForm, stock: Number(numericValue) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct.id) {
      onUpdateProduct({ ...productForm, id: editingProduct.id });
    } else {
      onAddProduct(productForm);
    }
  };

  return (
    <div
      role='dialog'
      aria-modal="true"
      className='p-6 border-t border-gray-200 bg-gray-50'
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          {editingProduct ? '상품 수정' : '새 상품 추가'}
        </h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='product-name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              상품명
            </label>
            <input
              id='product-name'
              name='name'
              type='text'
              value={productForm.name}
              onChange={handleTextChange}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              required
            />
          </div>
          <div>
            <label
              htmlFor='product-description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              설명
            </label>
            <input
              id='product-description'
              name='description'
              type='text'
              value={productForm.description}
              onChange={handleTextChange}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
            />
          </div>
          <div>
            <label
              htmlFor='product-price'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              가격
            </label>
            <input
              id='product-price'
              type='text'
              value={productForm.price}
              onChange={handlePriceChange}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              placeholder='숫자만 입력'
              required
            />
          </div>
          <div>
            <label
              htmlFor='product-stock'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              재고
            </label>
            <input
              id='product-stock'
              type='text'
              value={productForm.stock}
              onChange={handleStockChange}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              placeholder='숫자만 입력'
              required
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            취소
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'
          >
            {editingProduct ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </div>
  )
}
