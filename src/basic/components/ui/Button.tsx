import { ButtonHTMLAttributes, PropsWithoutRef } from "react";

interface ButtonProps
  extends PropsWithoutRef<ButtonHTMLAttributes<HTMLButtonElement>> {
  /**
   * variant: 버튼 스타일
   * - yellow: 노란색 (결제 버튼)
   * - black: 검정색 (새 상품 추가, 장바구니 담기)
   * - indigo: 인디고색 (상품 추가/수정, 쿠폰 생성)
   * - outline: 아웃라인 스타일 (취소 버튼)
   * - ghost: 투명 배경 (삭제, 관리자 전환 등)
   */
  variant?: "yellow" | "black" | "indigo" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantClasses = {
  yellow:
    "bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
  black:
    "bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
  indigo:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
  ghost:
    "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
};

const sizeClasses = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-sm",
  large: "py-3 px-6 text-base",
};

export default function Button({
  type = "button",
  variant = "black",
  size = "medium",
  disabled,
  className = "",
  children,
  onClick,
  ...props
}: ButtonProps) {
  const disabledClasses = disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100 focus:ring-0"
    : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md font-medium transition-colors ${
        sizeClasses[size]
      } ${disabled ? disabledClasses : variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
