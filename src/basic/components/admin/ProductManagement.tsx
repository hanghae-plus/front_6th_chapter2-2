import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { ProductWithUI } from '../../../types';

type ProductFormData = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

type ProductManagementProps = {
  products: ProductWithUI[];
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: ProductFormData;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  formatPrice: (price: number, productId?: string) => string;
  onAddProduct: () => void;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onSubmitProduct: (e: React.FormEvent) => void;
  onCancelProduct: () => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
};

export default function ProductManagement({
  products,
  showProductForm,
  editingProduct,
  productForm,
  setProductForm,
  formatPrice,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onSubmitProduct,
  onCancelProduct,
  addNotification,
}: ProductManagementProps) {
  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <button
            onClick={onAddProduct}
            className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        formatPrice={formatPrice}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
      />

      {showProductForm && (
        <ProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          editingProduct={editingProduct}
          onSubmit={onSubmitProduct}
          onCancel={onCancelProduct}
          addNotification={addNotification}
        />
      )}
    </section>
  );
}
