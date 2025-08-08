import { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = ({ children, ...props }: SelectProps) => {
  return (
    <select
      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      {...props}
    >
      {children}
    </select>
  );
};

const Option = ({
  children,
  ...props
}: SelectHTMLAttributes<HTMLOptionElement>) => {
  return <option {...props}>{children}</option>;
};

Select.Option = Option;
