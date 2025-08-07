// src/basic/components/Admin.tsx
import React, { useState } from 'react';
import { Product, Coupon } from '../types';
import { formatCurrency } from '../utils/formatters';
import { validateNumberInput } from '../utils/validators';
import { useToast } from '../utils/hooks/useToast';
import { TrashIcon } from './icons/TrashIcon';

type AdminPageTab = 'products' | 'coupons';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: (couponCode: string) => void;
}

export const Admin = ({
  products,
  coupons,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct,
  onAddCoupon,
  onRemoveCoupon,
}: Props) => {
  const [activeTab, setActiveTab] = useState<AdminPageTab>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<
    Omit<Product, 'id'> & { id?: string }
  >({ name: '', price: 0, stock: 0, description: '', discounts: [] });

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  const { showToast } = useToast();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = validateNumberInput(value);
    if (value === numericValue) {
      // 숫자만 포함된 경우에만 상태 업데이트
      setProductForm({ ...productForm, price: Number(numericValue) });
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = validateNumberInput(value);
    setProductForm({ ...productForm, stock: Number(numericValue) });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({ ...productForm, id: editingProduct.id });
    } else {
      onAddProduct(productForm);
    }
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  const handleCouponValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setCouponForm({ ...couponForm, discountValue: value });
    if (couponForm.discountType === 'percentage' && value > 100) {
      setCouponError('할인율은 100%를 초과할 수 없습니다');
    } else {
      setCouponError(null);
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      couponForm.discountType === 'percentage' &&
      couponForm.discountValue > 100
    ) {
      showToast('할인율은 100%를 초과할 수 없습니다');
      return;
    }
    onAddCoupon(couponForm);
    setShowCouponForm(false);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setCouponError(null);
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <section className='bg-white rounded-lg border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>상품 목록</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    price: 0,
                    stock: 0,
                    description: '',
                    discounts: [],
                  });
                  setShowProductForm(true);
                }}
                className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
              >
                새 상품 추가
              </button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    상품명
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    가격
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    재고
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    설명
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {products.map(product => (
                  <tr key={product.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {product.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatCurrency(product.price)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock}개
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                      {product.description || '-'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => startEditProduct(product)}
                        className='text-indigo-600 hover:text-indigo-900 mr-3'
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className='text-red-600 hover:text-red-900'
                        aria-label={`${product.name} 삭제`}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showProductForm && (
            <div
              role='dialog'
              className='p-6 border-t border-gray-200 bg-gray-50'
            >
              <form onSubmit={handleProductSubmit} className='space-y-4'>
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
                      type='text'
                      value={productForm.name}
                      onChange={e =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
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
                      type='text'
                      value={productForm.description}
                      onChange={e =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
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
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
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
          )}
        </section>
      ) : (
        <section className='bg-white rounded-lg border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
          </div>
          <div className='p-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {coupons.map(coupon => (
                <div
                  key={coupon.code}
                  className='relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200'
                >
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900'>
                        {coupon.name}
                      </h3>
                      <p className='text-sm text-gray-600 mt-1 font-mono'>
                        {coupon.code}
                      </p>
                      <div className='mt-2'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700'>
                          {coupon.discountType === 'amount'
                            ? `${coupon.discountValue.toLocaleString()}원 할인`
                            : `${coupon.discountValue}% 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveCoupon(coupon.code)}
                      className='text-gray-400 hover:text-red-600 transition-colors'
                      aria-label={`${coupon.name} 삭제`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}

              <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
                >
                  <svg
                    className='w-8 h-8'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                  <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                <form onSubmit={handleCouponSubmit} className='space-y-4'>
                  <h3 className='text-md font-medium text-gray-900'>
                    새 쿠폰 생성
                  </h3>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <div>
                      <label
                        htmlFor='coupon-name'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        쿠폰명
                      </label>
                      <input
                        id='coupon-name'
                        type='text'
                        value={couponForm.name}
                        onChange={e =>
                          setCouponForm({ ...couponForm, name: e.target.value })
                        }
                        className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
                        placeholder='신규 가입 쿠폰'
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='coupon-code'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        쿠폰 코드
                      </label>
                      <input
                        id='coupon-code'
                        type='text'
                        value={couponForm.code}
                        onChange={e =>
                          setCouponForm({
                            ...couponForm,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono'
                        placeholder='WELCOME2024'
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='coupon-discount-type'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        할인 타입
                      </label>
                      <select
                        id='coupon-discount-type'
                        value={couponForm.discountType}
                        onChange={e =>
                          setCouponForm({
                            ...couponForm,
                            discountType: e.target.value as
                              | 'amount'
                              | 'percentage',
                          })
                        }
                        className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
                      >
                        <option value='amount'>정액 할인</option>
                        <option value='percentage'>정률 할인</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor='coupon-discount-value'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        {couponForm.discountType === 'amount'
                          ? '할인 금액'
                          : '할인율(%)'}
                      </label>
                      <input
                        id='coupon-discount-value'
                        type='number'
                        value={couponForm.discountValue}
                        onChange={handleCouponValueChange}
                        onBlur={handleCouponValueChange}
                        className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
                        placeholder={
                          couponForm.discountType === 'amount' ? '5000' : '10'
                        }
                        required
                      />
                      {couponError && (
                        <p className='text-red-500 text-xs mt-1'>
                          {couponError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='flex justify-end gap-3'>
                    <button
                      type='button'
                      onClick={() => setShowCouponForm(false)}
                      className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                    >
                      취소
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'
                    >
                      쿠폰 생성
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
