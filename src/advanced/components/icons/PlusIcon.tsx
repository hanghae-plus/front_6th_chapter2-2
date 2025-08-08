import React from "react";

interface PlusIconProps {
  className?: string;
  strokeWidth?: number;
}

export const PlusIcon: React.FC<PlusIconProps> = ({
  className = "w-8 h-8",
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
};
