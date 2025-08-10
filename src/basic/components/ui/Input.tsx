import { InputHTMLAttributes, PropsWithoutRef } from "react";

interface InputProps
  extends PropsWithoutRef<InputHTMLAttributes<HTMLInputElement>> {
  className?: string;
  type?: "text" | "number" | "email" | "password" | "tel" | "url" | "search";
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
}

export default function Input({
  type = "text",
  className = "",
  value,
  onChange,
  label,
  placeholder,
  required,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border ${className}`}
        {...props}
      />
    </div>
  );
}
