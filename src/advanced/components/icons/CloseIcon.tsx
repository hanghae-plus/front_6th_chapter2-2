import React from "react";

interface CloseIconProps {
  className?: string;
  strokeWidth?: number;
}

export const CloseIcon: React.FC<CloseIconProps> = ({
  className = "w-4 h-4",
  strokeWidth = 2,
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};
