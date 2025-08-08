import { useAtom, useSetAtom } from 'jotai';

import ProductForm from '../components/admin/ProductForm';
import ProductTable from '../components/admin/ProductTable';
import { showProductFormAtom, editingProductIdAtom, productFormAtom } from '../store/atoms';

export default function ProductManagement() {
  const [showProductForm, setShowProductForm] = useAtom(showProductFormAtom);

  const setEditingProductId = useSetAtom(editingProductIdAtom);
  const setProductForm = useSetAtom(productFormAtom);

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <button
            onClick={() => {
              // open in create mode and reset form
              setEditingProductId('new');
              setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
              setShowProductForm(true);
            }}
            className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable />

      {showProductForm && <ProductForm />}
    </section>
  );
}
