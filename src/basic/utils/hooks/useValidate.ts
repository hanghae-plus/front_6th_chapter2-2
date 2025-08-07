import {
  isValidPrice,
  isValidStock,
  isValidDiscountValue,
  safeParseInt,
  extractNumbers,
} from "../validators";

const validateStockRange = (stock: number) => {
  if (stock < 0) {
    return {
      isValid: false,
      error: "재고는 0보다 커야 합니다",
      correctedValue: 0,
    };
  }

  if (stock > 9999) {
    return {
      isValid: false,
      error: "재고는 9999개를 초과할 수 없습니다",
      correctedValue: 9999,
    };
  }

  return { isValid: true, correctedValue: stock };
};

const validatePercentageRange = (percentage: number) => {
  if (percentage > 100) {
    return {
      isValid: false,
      error: "할인율은 100%를 초과할 수 없습니다",
      correctedValue: 100,
    };
  }

  if (percentage < 0) {
    return {
      isValid: false,
      error: "할인율은 0 이상이어야 합니다",
      correctedValue: 0,
    };
  }

  return { isValid: true, correctedValue: percentage };
};

const validateAmountRange = (amount: number) => {
  if (amount > 100000) {
    return {
      isValid: false,
      error: "할인 금액은 100,000원을 초과할 수 없습니다",
      correctedValue: 100000,
    };
  }

  if (amount < 0) {
    return {
      isValid: false,
      error: "할인 금액은 0 이상이어야 합니다",
      correctedValue: 0,
    };
  }

  return { isValid: true, correctedValue: amount };
};

export const useValidate = () => {
  const validatePrice = (value: string) => {
    const parsedPrice = safeParseInt(value);
    if (value === "") return { isValid: false, price: 0 };
    if (!isValidPrice(parsedPrice)) {
      return {
        isValid: false,
        error: "가격은 0보다 커야 합니다",
        price: 0,
      };
    }
    return { isValid: true, price: parsedPrice };
  };

  const validateStock = (value: string) => {
    const parsedStock = safeParseInt(value);
    if (value === "") return { isValid: false, stock: 0 };
    if (!isValidStock(parsedStock)) {
      const validation = validateStockRange(parsedStock);
      return {
        isValid: false,
        error: validation.error,
        stock: validation.correctedValue,
      };
    }
    return { isValid: true, stock: parsedStock };
  };

  const validateDiscountValue = (
    value: string,
    discountType: "amount" | "percentage"
  ) => {
    const parsedValue = safeParseInt(value);
    if (value === "") return { isValid: false, discountValue: 0 };
    if (!isValidDiscountValue(parsedValue, discountType)) {
      const validation =
        discountType === "percentage"
          ? validatePercentageRange(parsedValue)
          : validateAmountRange(parsedValue);

      return {
        isValid: false,
        error: validation.error,
        discountValue: validation.correctedValue,
      };
    }
    return { isValid: true, discountValue: parsedValue };
  };

  const filterNumericInput = (value: string) => {
    const numbersOnly = extractNumbers(value);
    return {
      shouldUpdate: value === "" || value === numbersOnly,
      filteredValue: safeParseInt(value),
    };
  };

  return {
    validatePrice,
    validateStock,
    validateDiscountValue,
    filterNumericInput,
  };
};
