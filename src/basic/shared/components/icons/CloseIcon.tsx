import type { SVGProps } from "react";

type CloseIconProps = SVGProps<SVGSVGElement>;

export function CloseIcon({ className = "w-4 h-4", ...rest }: CloseIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
