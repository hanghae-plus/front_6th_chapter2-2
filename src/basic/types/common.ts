/**
 * 공통 타입 정의
 */

export interface ActionResult {
  success: boolean;
  message: string;
  type?: "success" | "error" | "warning";
}

export type NotificationType = "error" | "success" | "warning";

// 새로운 알림 콜백 타입들 추가
export interface NotificationCallbacks {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onWarning?: (message: string) => void;
}

export interface StandardNotificationCallbacks {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

/**
 * 기본 엔티티 인터페이스
 */
export interface BaseEntity {
  id: string;
}

/**
 * 공통 핸들러 Props 인터페이스
 */
export interface BaseHandlerProps {
  addNotification: (message: string, type?: NotificationType) => void;
}

/**
 * 폼 데이터 기본 인터페이스
 */
export interface BaseFormData {
  [key: string]: any;
}

/**
 * CRUD 작업 타입
 */
export type CrudOperation = "create" | "read" | "update" | "delete";

/**
 * 정렬 방향
 */
export type SortDirection = "asc" | "desc";

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * 검색 필터
 */
export interface SearchFilter {
  query: string;
  field?: string;
}
