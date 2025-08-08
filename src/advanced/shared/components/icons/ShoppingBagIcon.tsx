import type { SVGProps } from "react";

type ShoppingBagIconProps = SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
};

export function ShoppingBagIcon({
  className = "w-5 h-5",
  strokeWidth = 2,
  ...rest
}: ShoppingBagIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}
