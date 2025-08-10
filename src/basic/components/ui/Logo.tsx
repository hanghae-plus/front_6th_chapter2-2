interface LogoProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Logo({ className = "", children = "SHOP" }: LogoProps) {
  return (
    <h1 className={`text-xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h1>
  );
}
