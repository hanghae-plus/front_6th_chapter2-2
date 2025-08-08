import { CartItem, ProductWithUI } from '../../../types';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';

// 초기 데이터
const initialProducts: ProductWithUI[] = [
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
  },
];

const getRemainingStock = ({
  product,
  cart,
}: {
  product: ProductWithUI;
  cart: CartItem[];
}): number => {
  return product.stock - (cart.find((item) => item.product.id === product.id)?.quantity ?? 0);
};

export function useProduct(
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void
) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
    addNotification('상품이 추가되었습니다.', 'success');
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
    addNotification('상품이 수정되었습니다.', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getRemainingStock,
  };
}
