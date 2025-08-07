import React from 'react';

const Form = ({
  onSubmit,
  children,
  title,
}: {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {children}
    </form>
  );
};

export default Form;
