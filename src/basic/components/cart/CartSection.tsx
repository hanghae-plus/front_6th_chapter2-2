interface SectionHeaderProps {
  children: React.ReactNode;
}

const CartSection = ({ children }: SectionHeaderProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      {children}
    </section>
  );
};

export default CartSection;
