import React, { createContext, useContext, useState, ReactNode } from "react";

interface CouponSelectionContextType {
  selectedCoupon: any | null;
  setSelectedCoupon: (coupon: any | null) => void;
}

const CouponSelectionContext = createContext<CouponSelectionContextType>({
  selectedCoupon: null,
  setSelectedCoupon: () => {},
});

export const useCouponSelectionContext = () => {
  const context = useContext(CouponSelectionContext);
  if (!context) {
    throw new Error(
      "useCouponSelectionContext must be used within a CouponSelectionProvider"
    );
  }
  return context;
};

interface CouponSelectionProviderProps {
  children: ReactNode;
}

export const CouponSelectionProvider: React.FC<
  CouponSelectionProviderProps
> = ({ children }) => {
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);

  const value = {
    selectedCoupon,
    setSelectedCoupon,
  };

  return (
    <CouponSelectionContext.Provider value={value}>
      {children}
    </CouponSelectionContext.Provider>
  );
};
