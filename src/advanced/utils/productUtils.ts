import { ProductWithUI } from "../types/product";

interface IStockChecker {
  productId: string;
  products: ProductWithUI[];
  getRemainingStock: (product: ProductWithUI) => number;
}

/** 품절 상태 확인 */
const checkSoldOut = ({ productId, products, getRemainingStock }: IStockChecker): boolean => {
  const product = products.find((p) => p.id === productId);
  return product ? getRemainingStock(product) <= 0 : false;
};

/** 가격을 포맷팅하는 함수 */
const formatCurrency = (price: number, isAdmin: boolean): string => {
  const formattedPrice = price.toLocaleString();
  return isAdmin ? `${formattedPrice}원` : `₩${formattedPrice}`;
};

/** 가격 포맷팅 */
export const formatPrice = (price: number, isAdmin: boolean, stockChecker?: IStockChecker): string => {
  // 품절 표시
  if (stockChecker && checkSoldOut(stockChecker)) {
    return "SOLD OUT";
  }

  // 가격 포맷팅
  return formatCurrency(price, isAdmin);
};

/** 새로운 상품 ID를 생성 */
export const generateProductId = (): string => {
  const timestamp = Date.now();
  return `p${timestamp}`;
};

/** 상품 생성 초기값 */
export const INITIAL_PRODUCT_FORM = { name: "", price: 0, stock: 0, description: "", discounts: [] as Array<{ quantity: number; rate: number }> };

/** 상품 테이블 헤더 */
export const PRODUCT_TABLE_HEADERS = [
  { label: "상품명", key: "name" },
  { label: "가격", key: "price" },
  { label: "재고", key: "stock" },
  { label: "설명", key: "description" },
  { label: "작업", key: "actions" },
];

const MIN_VALUE = 0; // 최소값
const MAX_STOCK = 9999; // 최대 재고

export const MAX_PRODUCT_NAME_LENGTH = 100; // 상품명 최대 길이
export const MAX_DESCRIPTION_LENGTH = 200; // 설명 최대 길이

/**
 * 상품 폼 검증 관련 유틸 함수들
 */
export const productValidation = {
  /** 가격 유효성 검증 */
  validatePrice: (price: number) => {
    if (price < MIN_VALUE) {
      return {
        isValid: false,
        message: "가격은 0보다 커야 합니다",
        correctedValue: MIN_VALUE,
      };
    }
    return { isValid: true };
  },

  /** 재고 유효성 검증 */
  validateStock: (stock: number) => {
    if (stock < MIN_VALUE) {
      return {
        isValid: false,
        message: "재고는 0보다 커야 합니다",
        correctedValue: MIN_VALUE,
      };
    } else if (stock > MAX_STOCK) {
      return {
        isValid: false,
        message: `재고는 ${MAX_STOCK}개를 초과할 수 없습니다`,
        correctedValue: MAX_STOCK,
      };
    }
    return { isValid: true };
  },
};

/** 할인 옵션 */
export const DISCOUNT_OPTIONS = {
  DEFAULT_DISCOUNT: { quantity: 10, rate: 0.1 }, // 기본 할인: 10개 이상 10% 할인
} as const;

const STOCK_WARNING = 10; // 재고 경고 임계값
const STOCK_DANGER = 0; // 재고 위험 임계값

/** 재고 상태에 따른 스타일 클래스 반환 */
export const getStockStatusStyle = (stock: number): string => {
  if (stock > STOCK_WARNING) {
    return "bg-green-100 text-green-800"; // 충분한 재고
  } else if (stock > STOCK_DANGER) {
    return "bg-yellow-100 text-yellow-800"; // 경고 상태
  } else {
    return "bg-red-100 text-red-800"; // 품절 상태
  }
};

/** 숫자만 허용 처리 */
export const processNumericInput = (value: string): number | null => {
  // 빈 문자열이거나 순수 숫자만 허용
  if (value === "" || /^\d+$/.test(value)) {
    return value === "" ? MIN_VALUE : parseInt(value);
  }
  return null; // 유효하지 않은 입력
};
