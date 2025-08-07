// 검증 유틸리티 함수들
// 구현할 함수:
// - isValidCouponCode(code: string): boolean - 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상)
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

export const isValidStock = (stock: string) => {
  if (stock === "") {
    return {
      isValid: true,
      stock: 0,
      message: "",
    };
  } else if (parseInt(stock) < 0) {
    return {
      isValid: false,
      stock: 0,
      message: "재고는 0보다 커야 합니다",
    };
  } else if (parseInt(stock) > 9999) {
    return {
      isValid: false,
      stock: 9999,
      message: "재고는 9999개를 초과할 수 없습니다",
    };
  }
  return {
    isValid: true,
    stock: parseInt(stock),
    message: "",
  };
};

export const isValidPrice = (price: string) => {
  if (price === "") {
    return {
      isValid: true,
      price: 0,
      message: "",
    };
  } else if (parseInt(price) < 0) {
    return {
      isValid: false,
      price: 0,
      message: "가격은 0보다 커야 합니다",
    };
  }

  return {
    isValid: true,
    price: parseInt(price),
    message: "",
  };
};

export const isValidDiscount = (discountType: string, value: number) => {
  if (discountType === "percentage") {
    if (value > 100) {
      return {
        isValid: false,
        discountValue: 100,
        message: "할인율은 100%를 초과할 수 없습니다",
      };
    } else if (value < 0) {
      return {
        isValid: true,
        discountValue: 0,
        message: "",
      };
    }
  } else if (discountType === "amount") {
    if (value > 100000) {
      return {
        isValid: false,
        discountValue: 100000,
        message: "할인 금액은 100,000원을 초과할 수 없습니다",
      };
    } else if (value < 0) {
      return {
        isValid: true,
        discountValue: 0,
        message: "",
      };
    }
  }
  return {
    isValid: true,
    discountValue: value,
    message: "",
  };
};

export const extractNumbers = (value: string) => {
  if (value === "") {
    return {
      isValid: true,
      value: 0,
    };
  }

  if (/^\d+$/.test(value)) {
    return {
      isValid: true,
      value: parseInt(value),
    };
  }

  return {
    isValid: false,
    value: 0,
  };
};
