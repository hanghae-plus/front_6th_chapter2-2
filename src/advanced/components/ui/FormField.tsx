import React from 'react';

interface FieldProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({ title, children, className }: FieldProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {title}
      </label>
      {children}
    </div>
  );
};

export default FormField;
