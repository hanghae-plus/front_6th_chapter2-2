import { type PropsWithChildren } from "react";

type BadgeContainerProps = PropsWithChildren<{
  label: string;
  visible: boolean;
}>;

export function BadgeContainer({ label, visible, children }: BadgeContainerProps) {
  return (
    <div className="relative">
      {children}
      {visible && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {label}
        </span>
      )}
    </div>
  );
}
