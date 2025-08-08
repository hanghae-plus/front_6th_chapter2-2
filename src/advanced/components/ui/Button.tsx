// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "payment";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  sizes?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  sizes = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  // 기존 스타일을 완전히 똑같이 복사
  const variantClasses = {
    primary:
      "bg-gray-900 text-white transition-colors hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    ghost: "text-gray-600 hover:text-gray-900 transition-colors",
    payment:
      "bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm rounded",
    lg: "px-4 py-2 rounded-md font-medium",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const classes = [
    variantClasses[variant],
    sizeClasses[sizes],
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
