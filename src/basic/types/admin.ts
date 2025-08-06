import { Product } from "../../types";

// 쿠폰 관련 타입
export interface Coupon {
  code: string;
  name: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export interface CouponFormState {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

// 상품 관련 타입 (기존 ProductWithUI 확장)
export interface ProductDiscount {
  quantity: number;
  rate: number;
}

export interface ProductFormState {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<ProductDiscount>;
}

// 관리자 탭 타입
export type AdminTab = "products" | "coupons";

// 알림 타입
export type NotificationType = "success" | "error";

// 이벤트 핸들러 타입들
export interface ProductHandlers {
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAdd: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export interface CouponHandlers {
  onDelete: (couponCode: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// 상태 설정 함수 타입들
export interface ProductFormActions {
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormState>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface CouponFormActions {
  setCouponForm: React.Dispatch<React.SetStateAction<CouponFormState>>;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// 관리자 상태 그룹
export interface AdminProductState {
  products: Product[];
  productForm: ProductFormState;
  showProductForm: boolean;
  editingProduct: string | null;
}

export interface AdminCouponState {
  coupons: Coupon[];
  couponForm: CouponFormState;
  showCouponForm: boolean;
}

// 유틸리티 함수 타입
export interface AdminUtils {
  addNotification: (message: string, type: NotificationType) => void;
}

// 전체 관리자 상태 타입
export interface AdminState {
  activeTab: AdminTab;
  productState: AdminProductState;
  couponState: AdminCouponState;
}

// Props 그룹 타입들
export interface ProductManagementProps {
  state: AdminProductState;
  handlers: ProductHandlers;
  actions: ProductFormActions;
  utils: AdminUtils;
}

export interface CouponManagementProps {
  state: AdminCouponState;
  handlers: CouponHandlers;
  actions: CouponFormActions;
  utils: Pick<AdminUtils, "addNotification">;
}

// 관리자 페이지 메인 Props
export interface AdminPageProps {
  productProps: ProductManagementProps;
  couponProps: CouponManagementProps;
}

// 초기값 상수들
export const INITIAL_PRODUCT_FORM: ProductFormState = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

export const INITIAL_COUPON_FORM: CouponFormState = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

// 검증 관련 상수들
export const VALIDATION_LIMITS = {
  MAX_STOCK: 9999,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MAX_DISCOUNT_AMOUNT: 100000,
  MIN_VALUE: 0,
} as const;

// 관리자 탭 정보
export const ADMIN_TABS = {
  PRODUCTS: "products" as const,
  COUPONS: "coupons" as const,
} as const;

export const ADMIN_TAB_LABELS = {
  [ADMIN_TABS.PRODUCTS]: "상품 관리",
  [ADMIN_TABS.COUPONS]: "쿠폰 관리",
} as const;
