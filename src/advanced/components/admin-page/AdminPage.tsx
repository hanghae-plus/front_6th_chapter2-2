// TODO: 관리자 페이지 컴포넌트
// 힌트:
// 1. 탭 UI로 상품 관리와 쿠폰 관리 분리
// 2. 상품 추가/수정/삭제 기능
// 3. 쿠폰 생성 기능
// 4. 할인 규칙 설정
//
// 필요한 hooks:
// - useProducts: 상품 CRUD
// - useCoupons: 쿠폰 CRUD
//
// 하위 컴포넌트:
// - ProductForm: 새 상품 추가 폼
// - ProductAccordion: 상품 정보 표시 및 수정
// - CouponForm: 새 쿠폰 추가 폼
// - CouponList: 쿠폰 목록 표시

import { useState, type ReactNode } from 'react';
import {
  useAddCoupon,
  useCoupons,
  useDeleteCoupon,
} from '../../hooks/useCoupons';
import {
  useAddProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '../../hooks/useProducts';
import { AdminTabs, type AdminTab } from './AdminTabs';
import { CouponsTab } from './coupons-tab/CouponsTab';
import { ProductsTab } from './products-tab/ProductsTab';
import { PageInfo } from './ui/PageInfo';
import { PageTitle } from './ui/PageTItle';

interface Props {}

export function AdminPage({}: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const addCoupon = useAddCoupon();
  const deleteCoupon = useDeleteCoupon();
  const coupons = useCoupons();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const products = useProducts();

  const tabContent: Record<AdminTab, ReactNode> = {
    coupons: (
      <CouponsTab
        coupons={coupons}
        addCoupon={addCoupon}
        deleteCoupon={deleteCoupon}
      />
    ),
    products: (
      <ProductsTab
        products={products}
        addProduct={addProduct}
        deleteProduct={deleteProduct}
        updateProduct={updateProduct}
      />
    ),
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <PageTitle />
        <PageInfo />
      </div>

      <AdminTabs
        activeTab={activeTab}
        onClickTab={({ id }) => {
          setActiveTab(id);
        }}
      />

      {tabContent[activeTab]}
    </div>
  );
}
