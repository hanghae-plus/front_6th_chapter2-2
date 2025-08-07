import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

const defaultIconProps = {
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 2,
};

/**
 * 닫기/삭제 X 아이콘
 */
export const CloseIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * 장바구니 아이콘 (헤더용)
 */
export const CartIcon: React.FC<IconProps> = ({
  className = "w-6 h-6",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

/**
 * 쇼핑백 아이콘 (장바구니 컴포넌트용)
 */
export const ShoppingBagIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

/**
 * 휴지통 삭제 아이콘
 */
export const TrashIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

/**
 * 플러스 추가 아이콘
 */
export const PlusIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M12 4v16m8-8H4" />
  </svg>
);

/**
 * 마이너스 아이콘
 */
export const MinusIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M20 12H4" />
  </svg>
);

/**
 * 아래 화살표 아이콘
 */
export const ChevronDownIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/**
 * 위 화살표 아이콘
 */
export const ChevronUpIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

/**
 * 체크 아이콘
 */
export const CheckIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/**
 * 이미지 플레이스홀더 아이콘
 */
export const ImageIcon: React.FC<IconProps> = ({
  className = "w-24 h-24",
  ...props
}) => (
  <svg {...defaultIconProps} className={className} strokeWidth={1} {...props}>
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
