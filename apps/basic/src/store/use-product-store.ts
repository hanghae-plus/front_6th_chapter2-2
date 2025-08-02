import { ProductView } from '@/models/product';
import { useLocalStorage } from '@/shared/hooks';
import { createStorage } from '@/utils';

const productStorage = createStorage<ProductView[]>({
  key: 'products',
  value: [
    {
      id: 'p1',
      name: '상품1',
      price: 10000,
      stock: 20,
      discounts: [
        { quantity: 10, rate: 0.1 },
        { quantity: 20, rate: 0.2 },
      ],
      description: '최고급 품질의 프리미엄 상품입니다.',
      isRecommended: false,
    },
    {
      id: 'p2',
      name: '상품2',
      price: 20000,
      stock: 20,
      discounts: [{ quantity: 10, rate: 0.15 }],
      description: '다양한 기능을 갖춘 실용적인 상품입니다.',
      isRecommended: true,
    },
    {
      id: 'p3',
      name: '상품3',
      price: 30000,
      stock: 20,
      discounts: [
        { quantity: 10, rate: 0.2 },
        { quantity: 30, rate: 0.25 },
      ],
      description: '대용량과 고성능을 자랑하는 상품입니다.',
      isRecommended: false,
    },
  ],
});

export const useProductStore = () => {
  const products = useLocalStorage(productStorage) ?? [];

  const addProduct = (product: ProductView) => {
    productStorage.set([...(productStorage.get() ?? []), product]);
  };

  const findProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const updateProduct = (id: string, updates: Partial<ProductView>) => {
    productStorage.set(
      productStorage
        .get()
        ?.map(p => (p.id === id ? { ...p, ...updates } : p)) ?? []
    );
  };

  const removeProductById = (id: string) => {
    productStorage.set(productStorage.get()?.filter(p => p.id !== id) ?? []);
  };

  return {
    products: products ?? [],
    addProduct,
    updateProduct,
    findProductById,
    removeProductById,
  };
};
