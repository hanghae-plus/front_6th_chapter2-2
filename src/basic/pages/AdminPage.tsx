import { useState, useCallback } from 'react';
import { Coupon } from '../../types';
import { ProductWithUI } from '../shared/types';
import { formatKoreanPrice, formatPercentage } from '../shared/utils';
import { validator } from '../shared/utils/validators';
import { MESSAGES } from '../constants/message';
import { CloseIcon, TrashIcon, PlusIcon } from '../components/icons';
import { useCouponForm } from '../hooks/useCouponForm';
import { CouponForm } from '../components/admin/CouponForm';

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
  selectedCoupon: Coupon | null;
  selectCoupon: (coupon: Coupon | null) => void;
}

export function AdminPage({
  products,
  coupons,
  addProduct: addProductHook,
  updateProduct: updateProductHook,
  deleteProduct: deleteProductHook,
  addCoupon: addCouponHook,
  deleteCoupon: deleteCouponHook,
  addNotification,
  selectedCoupon,
  selectCoupon,
}: AdminPageProps) {
  const {
    couponForm,
    updateName,
    updateCode,
    updateDiscountType,
    updateDiscountValue,
    validateDiscountValue,
    submitForm,
  } = useCouponForm();

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  // 상품 관련 상태
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const toggleCouponForm = () => setShowCouponForm((prev) => !prev);
  const toggleProductForm = () => setShowProductForm((prev) => !prev);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProductHook(newProduct);
      addNotification(MESSAGES.PRODUCT.ADDED, 'success');
    },
    [addProductHook, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProductHook(productId, updates);
      addNotification(MESSAGES.PRODUCT.UPDATED, 'success');
    },
    [updateProductHook, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      deleteProductHook(productId);
      addNotification(MESSAGES.PRODUCT.DELETED, 'success');
    },
    [deleteProductHook, addNotification],
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      addCouponHook(newCoupon);
      addNotification(MESSAGES.COUPON.ADDED, 'success');
    },
    [addCouponHook, addNotification],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCouponHook(couponCode);
      if (selectedCoupon?.code === couponCode) {
        selectCoupon(null);
      }
      addNotification(MESSAGES.COUPON.DELETED, 'success');
    },
    [deleteCouponHook, selectedCoupon, selectCoupon, addNotification],
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct(productForm);
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      submitForm(e, addCoupon, () => setShowCouponForm(false));
    },
    [submitForm, addCoupon],
  );

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
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
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <button
                onClick={() => {
                  setEditingProduct('new');
                  setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
                  setShowProductForm(true);
                }}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                새 상품 추가
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    재고
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    설명
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(activeTab === 'products' ? products : products).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatKoreanPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showProductForm && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                    <input
                      type="text"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
                    <input
                      type="text"
                      value={productForm.price === 0 ? '' : productForm.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericString = validator.validateNumericString(value);
                        if (numericString !== null) {
                          setProductForm({
                            ...productForm,
                            price: numericString === '' ? 0 : parseInt(numericString),
                          });
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        const price = value === '' ? 0 : parseInt(value);
                        const validation = validator.isValidPrice(price);

                        if (!validation.isValid) {
                          addNotification(validation.message, 'error');
                        }
                        setProductForm({ ...productForm, price: validation.correctedValue });
                      }}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                      placeholder="숫자만 입력"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
                    <input
                      type="text"
                      value={productForm.stock === 0 ? '' : productForm.stock}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericString = validator.validateNumericString(value);
                        if (numericString !== null) {
                          setProductForm({
                            ...productForm,
                            stock: numericString === '' ? 0 : parseInt(numericString),
                          });
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        const stock = value === '' ? 0 : parseInt(value);
                        const validation = validator.isValidStock(stock);

                        if (!validation.isValid) {
                          addNotification(validation.message, 'error');
                        }
                        setProductForm({ ...productForm, stock: validation.correctedValue });
                      }}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                      placeholder="숫자만 입력"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
                  <div className="space-y-2">
                    {productForm.discounts.map((discount, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <input
                          type="number"
                          value={discount.quantity}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                            setProductForm({ ...productForm, discounts: newDiscounts });
                          }}
                          className="w-20 px-2 py-1 border rounded"
                          min="1"
                          placeholder="수량"
                        />
                        <span className="text-sm">개 이상 구매 시</span>
                        <input
                          type="number"
                          value={discount.rate * 100}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                            setProductForm({ ...productForm, discounts: newDiscounts });
                          }}
                          className="w-16 px-2 py-1 border rounded"
                          min="0"
                          max="100"
                          placeholder="%"
                        />
                        <span className="text-sm">% 할인</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
                            setProductForm({ ...productForm, discounts: newDiscounts });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProductForm({
                          ...productForm,
                          discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
                        });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + 할인 추가
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
                      setShowProductForm(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    {editingProduct === 'new' ? '추가' : '수정'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                          {coupon.discountType === 'amount'
                            ? `${formatKoreanPrice(coupon.discountValue)} 할인`
                            : `${formatPercentage(coupon.discountValue / 100)} 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <PlusIcon />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <CouponForm
                couponForm={couponForm}
                updateName={updateName}
                updateCode={updateCode}
                updateDiscountType={updateDiscountType}
                updateDiscountValue={updateDiscountValue}
                validateDiscountValue={validateDiscountValue}
                handleCouponSubmit={handleCouponSubmit}
                addNotification={addNotification}
                toggleCouponForm={toggleCouponForm}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminPage;
