/**
 * 토스트 설정 기본값
 */
export const TOAST_DEFAULTS = {
  position: 'top-right' as const,
  maxWidth: 'max-w-sm',
  spacing: 'space-y-2',
  zIndex: 'z-50',
} as const;

/**
 * 토스트 애니메이션 클래스 (Tailwind CSS 기반)
 */
export const TOAST_ANIMATION_CLASSES = {
  enter: 'transition-all duration-300 ease-in-out transform translate-x-0 opacity-100',
  exit: 'transition-all duration-300 ease-in-out transform translate-x-full opacity-0',
  hover: 'hover:shadow-lg hover:scale-105',
} as const;

/**
 * 토스트 테마 색상
 */
export const TOAST_THEMES = {
  success: {
    background: 'bg-green-600',
    text: 'text-white',
    icon: '✓',
  },
  error: {
    background: 'bg-red-600',
    text: 'text-white',
    icon: '✕',
  },
  warning: {
    background: 'bg-yellow-600',
    text: 'text-white',
    icon: '⚠',
  },
  info: {
    background: 'bg-blue-600',
    text: 'text-white',
    icon: 'ℹ',
  },
} as const;
