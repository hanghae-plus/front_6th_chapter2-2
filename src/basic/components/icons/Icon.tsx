import * as React from "react";

// 기본 아이콘 Props 인터페이스
export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// 각 아이콘 컴포넌트 정의
const CartIcon: React.FC<IconProps> = ({
  size = 6,
  color = "text-gray-700",
  className = "",
  onClick,
  disabled = false,
}) => {
  const baseClasses = `w-${size} h-${size} ${color} ${className}`;
  const interactiveClasses = onClick
    ? "cursor-pointer hover:scale-105 transition-transform"
    : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <svg
      className={`${baseClasses} ${interactiveClasses} ${disabledClasses}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      onClick={!disabled ? onClick : undefined}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
};

// 네임스페이스 객체 정의
const Icon = {
  cart: CartIcon,
} as const;

export type IconType = keyof typeof Icon;
export type IconNamespace = typeof Icon;

export default Icon as IconNamespace;
