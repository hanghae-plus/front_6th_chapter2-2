import { PropsWithoutRef, SVGProps } from "react";

interface ShoppingBagIconProps
  extends PropsWithoutRef<SVGProps<SVGSVGElement>> {
  size?: "small" | "medium" | "large";
}

export default function ShoppingBagIcon({
  size = "large",
  className,
  ...props
}: ShoppingBagIconProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const defaultClassName = `text-gray-300 ${sizeClasses[size]}`;

  return (
    <svg
      className={className || defaultClassName}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}
