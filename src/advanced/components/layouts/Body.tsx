interface BodyProps {
  children: React.ReactNode;
}

export const Body = ({ children }: BodyProps) => {
  return <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>;
};
