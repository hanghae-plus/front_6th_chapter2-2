import React from "react";

interface CartIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const CartIcon: React.FC<CartIconProps> = ({
  className = "w-6 h-6",
  size,
  strokeWidth = 1,
}) => {
  const sizeClass = size ? `w-${size} h-${size}` : className;

  return (
    <svg
      className={sizeClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
};
