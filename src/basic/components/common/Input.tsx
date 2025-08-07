import { ChangeEvent, FocusEvent } from "react";

interface InputProps {
  labelText: string;
  type: "text" | "number";
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  placeholder?: string;
  required?: boolean;
}
const Input = ({
  labelText,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
}: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {labelText}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;
