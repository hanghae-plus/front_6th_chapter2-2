import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "dark"
  | "warning"
  | "danger"
  | "link"
  | "icon";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500",
  dark: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
  warning:
    "bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus:ring-yellow-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  link: "text-blue-600 hover:underline bg-transparent border-none p-0 focus:ring-blue-500",
  icon: "text-gray-400 hover:text-gray-600 bg-transparent border-none p-0 focus:ring-gray-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const baseStyles =
  "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export function IconButton({
  children,
  size = "md",
  variant = "icon",
  className = "",
  ...props
}: Omit<ButtonProps, "variant"> & { variant?: "icon" | "danger" }) {
  const iconSizes = {
    xs: "w-4 h-4 p-1",
    sm: "w-5 h-5 p-1.5",
    md: "w-6 h-6 p-1.5",
    lg: "w-8 h-8 p-2",
  };

  return (
    <Button
      variant={variant}
      className={`${iconSizes[size]} rounded ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
