import { useState } from "react";

import AdminSection from "@/advanced/features/admin/components/AdminSection";
import ProductForm from "@/advanced/features/admin/components/ProductAdmin/ProductForm";
import ProductListRow from "@/advanced/features/admin/components/ProductAdmin/ProductListRow";
import { useProducts } from "@/advanced/features/product/hooks/useProducts";
import { ProductWithUI } from "@/advanced/features/product/types/product";
import { DEFAULTS } from "@/advanced/shared/constants/defaults";

export default function ProductAdmin() {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(DEFAULTS.PRODUCT_FORM);
  const [showProductForm, setShowProductForm] = useState(false);

  const { products } = useProducts();

  const handleClickAddProduct = () => {
    setEditingProduct("new");
    setProductForm(DEFAULTS.PRODUCT_FORM);
    setShowProductForm(true);
  };

  return (
    <AdminSection>
      <AdminSection.Header>
        <div className="flex justify-between items-center">
          <AdminSection.Title>상품 목록</AdminSection.Title>
          <button
            onClick={handleClickAddProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </AdminSection.Header>

      <AdminSection.Content>
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
            {products.map((product: ProductWithUI) => (
              <ProductListRow
                key={product.id}
                product={product}
                setEditingProduct={setEditingProduct}
                setProductForm={setProductForm}
                setShowProductForm={setShowProductForm}
              />
            ))}
          </tbody>
        </table>

        {showProductForm && (
          <ProductForm
            editingProduct={editingProduct}
            productForm={productForm}
            setEditingProduct={setEditingProduct}
            setProductForm={setProductForm}
            setShowProductForm={setShowProductForm}
          />
        )}
      </AdminSection.Content>
    </AdminSection>
  );
}
