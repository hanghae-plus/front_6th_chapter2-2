import type { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

type SearchInputProps = Omit<ComponentPropsWithRef<"input">, "size" | "color"> & {
  label?: string;
  size?: "lg" | "md";
  color?: "blue" | "indigo";
};

const inputVariants = tv({
  base: "w-full border border-gray-300 py-2",
  variants: {
    size: {
      md: "rounded-md px-3",
      lg: "rounded-lg px-4"
    },
    color: {
      blue: "focus:border-blue-500 focus:outline-none",
      indigo: "focus:border-indigo-500 focus:ring-indigo-500"
    }
  },
  defaultVariants: {
    size: "md",
    color: "indigo"
  }
});

export function SearchInput({ className, label, size, color, ...rest }: SearchInputProps) {
  return (
    <>
      {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
      <input className={inputVariants({ size, color, className })} {...rest} />
    </>
  );
}
