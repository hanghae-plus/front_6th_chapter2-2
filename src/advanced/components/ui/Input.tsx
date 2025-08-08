import { InputHTMLAttributes, PropsWithChildren } from "react";
import { Label } from "./Label";

// 상태공유 필요 시 Root에 context 추가해서 확장 가능

export const Input = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  sizes?: "sm" | "md";
}

const Field = ({
  className,
  fullWidth = true,
  sizes = "md",
  ...props
}: FieldProps) => {
  const sizeClass = {
    sm: "px-2 py-1 rounded border",
    md: "px-3 py-2 rounded-md shadow-sm border-gray-300",
  };

  return (
    <input
      className={`focus:ring-indigo-500 focus:border-indigo-500 border
        ${fullWidth ? "w-full" : ""} ${sizeClass[sizes]} ${className}`}
      {...props}
    />
  );
};

Input.Label = Label;
Input.Field = Field;
