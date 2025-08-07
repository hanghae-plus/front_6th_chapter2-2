import { ProductWithUI } from '../../datas/products';
import { formatAdminPrice } from '../../utils/formatters';
import { useProductForm } from '../../hooks/useProductForm';
import ProductForm from './ProductForm';

interface ProductManagementProps {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (id: string) => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

const ProductManagement = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  addNotification
}: ProductManagementProps) => {
  const productForm = useProductForm(addProduct, updateProduct, addNotification);

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={productForm.startAdd}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatAdminPrice(product.price)}</td>
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
                    onClick={() => productForm.startEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    수정
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productForm.showForm && <ProductForm productForm={productForm} />}
    </section>
  );
};

export default ProductManagement;
