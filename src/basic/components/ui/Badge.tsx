import { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  color?: "orange" | "red";
}

const Badge = ({
  children,
  color = "orange",
  className,
  ...props
}: BadgeProps) => {
  const colorClass = {
    orange: "bg-orange-500",
    red: "bg-red-500",
  }[color];

  return (
    <span
      className={`text-white text-xs px-2 py-1 rounded ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
