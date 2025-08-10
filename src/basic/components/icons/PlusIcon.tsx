import { PropsWithoutRef, SVGProps } from "react";

export default function PlusIcon({
  className,
  ...props
}: PropsWithoutRef<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      className={`w-8 h-8 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}
