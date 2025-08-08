import type { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

type ButtonProps = Omit<ComponentPropsWithRef<"button">, "size" | "color"> & {
  size?: "lg" | "md" | "sm";
  color?: "primary" | "secondary" | "danger" | "dark" | "neutral" | "yellow";
};

const buttonVariants = tv({
  base: "rounded font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-base"
    },
    color: {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100",
      danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
      dark: "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400",
      neutral: "bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-400",
      yellow: "bg-yellow-400 text-gray-900 hover:bg-yellow-500 disabled:bg-yellow-200"
    }
  },
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

export function Button({ className, size, color, ...rest }: ButtonProps) {
  return <button className={buttonVariants({ size, color, className })} {...rest} />;
}
