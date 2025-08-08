import { FormEvent, ChangeEvent, FocusEvent } from 'react';
import { ProductWithUI } from '../../../types';
import { Button } from '../../../shared/components';
import { useProductList } from '../../hooks/admin';
import { useCart } from '../../hooks/cart/useCart';
import { useProduct } from '../../hooks/product/useProduct';
import { ProductTable } from './ProductTable';
import { useNotification } from '../../hooks/notification/useNotification';
import { getRemainingStock } from '../../utils/cart';

type ProductForm = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

type SubmitResult = {
  success: boolean;
  message?: string;
};

export function ProductList() {
  const { addNotification } = useNotification();
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();

  const {
    showProductForm,
    editingProduct,
    productForm,
    resetProductForm,
    handleNewProduct,
    handleEditProduct,
    handleFormSubmit,
    handleProductFormChange,
    validateProductForm,
  } = useProductList({ addProduct, updateProduct });

  const { cart } = useCart();

  const remainingStock = (product: ProductWithUI) => getRemainingStock({ product, cart });

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  const handleSubmitProduct = (e: FormEvent): SubmitResult => {
    const result = handleFormSubmit(e);
    if (result.success) {
      addNotification(
        editingProduct && editingProduct !== 'new'
          ? '상품이 수정되었습니다.'
          : '상품이 추가되었습니다.',
        'success'
      );
    }
    return result;
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <ProductListHeader onNewProduct={handleNewProduct} />
      <ProductTable
        products={products}
        remainingStock={remainingStock}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          onProductFormChange={handleProductFormChange}
          onProductSubmit={handleSubmitProduct}
          onResetForm={resetProductForm}
          validateProductForm={validateProductForm}
          addNotification={addNotification}
        />
      )}
    </section>
  );
}

// 상품 목록 헤더
interface ProductListHeaderProps {
  onNewProduct: () => void;
}

function ProductListHeader({ onNewProduct }: ProductListHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">상품 목록</h2>
        <Button onClick={onNewProduct} variant="primary">
          새 상품 추가
        </Button>
      </div>
    </div>
  );
}

// 상품 폼
interface ProductFormProps {
  editingProduct: string | null;
  productForm: ProductForm;
  onProductFormChange: (form: Partial<ProductForm>) => void;
  onProductSubmit: (e: FormEvent) => SubmitResult;
  onResetForm: () => void;
  validateProductForm: (field: keyof ProductForm, value: number) => ValidationResult;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

function ProductForm({
  editingProduct,
  productForm,
  onProductFormChange,
  onProductSubmit,
  onResetForm,
  validateProductForm,
  addNotification,
}: ProductFormProps) {
  const handleSubmit = (e: FormEvent) => {
    const result = onProductSubmit(e);
    if (result.success) {
      onResetForm();
    }
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProductFormHeader editingProduct={editingProduct} />
        <ProductFormFields
          productForm={productForm}
          onProductFormChange={onProductFormChange}
          validateProductForm={validateProductForm}
          addNotification={addNotification}
        />
        <ProductFormActions editingProduct={editingProduct} onResetForm={onResetForm} />
      </form>
    </div>
  );
}

// 폼 헤더
interface ProductFormHeaderProps {
  editingProduct: string | null;
}

function ProductFormHeader({ editingProduct }: ProductFormHeaderProps) {
  return (
    <h3 className="text-lg font-medium text-gray-900">
      {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
    </h3>
  );
}

// 폼 필드들
interface ProductFormFieldsProps {
  productForm: ProductForm;
  onProductFormChange: (form: Partial<ProductForm>) => void;
  validateProductForm: (field: keyof ProductForm, value: number) => ValidationResult;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

function ProductFormFields({
  productForm,
  onProductFormChange,
  validateProductForm,
  addNotification,
}: ProductFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ProductNameField productForm={productForm} onProductFormChange={onProductFormChange} />
      <ProductDescriptionField
        productForm={productForm}
        onProductFormChange={onProductFormChange}
      />
      <ProductPriceField
        productForm={productForm}
        onProductFormChange={onProductFormChange}
        validateProductForm={validateProductForm}
        addNotification={addNotification}
      />
      <ProductStockField
        productForm={productForm}
        onProductFormChange={onProductFormChange}
        validateProductForm={validateProductForm}
        addNotification={addNotification}
      />
    </div>
  );
}

// 상품명 필드
interface ProductNameFieldProps {
  productForm: ProductForm;
  onProductFormChange: (form: Partial<ProductForm>) => void;
}

function ProductNameField({ productForm, onProductFormChange }: ProductNameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
      <input
        type="text"
        value={productForm.name}
        onChange={(e) => onProductFormChange({ name: e.target.value })}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
        required
      />
    </div>
  );
}

// 상품 설명 필드
interface ProductDescriptionFieldProps {
  productForm: ProductForm;
  onProductFormChange: (form: Partial<ProductForm>) => void;
}

function ProductDescriptionField({
  productForm,
  onProductFormChange,
}: ProductDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
      <input
        type="text"
        value={productForm.description}
        onChange={(e) => onProductFormChange({ description: e.target.value })}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
      />
    </div>
  );
}

// 상품 가격 필드
interface ProductPriceFieldProps {
  productForm: ProductForm;
  onProductFormChange: (form: Partial<ProductForm>) => void;
  validateProductForm: (field: keyof ProductForm, value: number) => ValidationResult;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

function ProductPriceField({
  productForm,
  onProductFormChange,
  validateProductForm,
  addNotification,
}: ProductPriceFieldProps) {
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onProductFormChange({
        price: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handlePriceBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onProductFormChange({ price: 0 });
    } else {
      const numValue = parseInt(value);
      const validation = validateProductForm('price', numValue);
      if (!validation.isValid && validation.message) {
        addNotification(validation.message, 'error');
        onProductFormChange({ price: 0 });
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
      <input
        type="text"
        value={productForm.price === 0 ? '' : productForm.price}
        onChange={handlePriceChange}
        onBlur={handlePriceBlur}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
        placeholder="숫자만 입력"
        required
      />
    </div>
  );
}

// 상품 재고 필드
interface ProductStockFieldProps {
  productForm: ProductForm;
  onProductFormChange: (form: Partial<ProductForm>) => void;
  validateProductForm: (field: keyof ProductForm, value: number) => ValidationResult;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

function ProductStockField({
  productForm,
  onProductFormChange,
  validateProductForm,
  addNotification,
}: ProductStockFieldProps) {
  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onProductFormChange({
        stock: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleStockBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onProductFormChange({ stock: 0 });
    } else {
      const numValue = parseInt(value);
      const validation = validateProductForm('stock', numValue);
      if (!validation.isValid && validation.message) {
        addNotification(validation.message, 'error');

        // Auto-correct to valid range
        if (numValue < 0) {
          onProductFormChange({ stock: 0 });
        } else if (numValue > 9999) {
          onProductFormChange({ stock: 9999 });
        }
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
      <input
        type="text"
        value={productForm.stock === 0 ? '' : productForm.stock}
        onChange={handleStockChange}
        onBlur={handleStockBlur}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
        placeholder="숫자만 입력"
        required
      />
    </div>
  );
}

// 폼 액션 버튼들
interface ProductFormActionsProps {
  editingProduct: string | null;
  onResetForm: () => void;
}

function ProductFormActions({ editingProduct, onResetForm }: ProductFormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" onClick={onResetForm} variant="secondary">
        취소
      </Button>
      <Button type="submit" variant="primary">
        {editingProduct === 'new' ? '추가' : '수정'}
      </Button>
    </div>
  );
}
