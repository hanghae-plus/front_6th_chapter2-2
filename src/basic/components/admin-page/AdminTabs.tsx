import { Tab } from '../ui/Tab';

export type AdminTab = 'products' | 'coupons';

interface Props {
  activeTab: AdminTab;
  onClickTab: (params: { id: AdminTab; name: string }) => void;
}

export function AdminTabs({ activeTab, onClickTab }: Props) {
  return (
    <Tab
      activeTab={activeTab}
      tabs={[
        {
          id: 'products',
          name: '상품 관리',
        },
        {
          id: 'coupons',
          name: '쿠폰 관리',
        },
      ]}
      onClickTab={onClickTab}
    />
  );
}
