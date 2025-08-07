import { ProductWithUI } from "../../types";

// utils의 경우에는 price나 cart처럼 entity를 받으면 안된다. number나 arr처럼 변환되서 받아야함
// FE 개발자는
// 도메인 로직 = 요구사항이 잘 안변하는데 세부 명세는 바뀔 수 있음을 의식하면서 코딩하고
// 유틸 로직 = 기능이 잘 안변하고 재사용을 할거라를 기대하면서 코딩한다

// 수정 필요
// 1)조짐
// 기능을 빼달라고 하거나 disabled해달라고 했을때 한번에 안된다
// 2)분명 기능수정을 하는데 여러파일이나 여러군데를 고치고 있다.
// 3)똑같은 기능을 내가 다른데서도 추가하고 있다.
// 4)분명 1개를 수정했는데 다른 곳도 QA를 해야하거나 코드 컨플릭트가 난다

export const formatPrice = (
  product: ProductWithUI | undefined,
  isAdmin: boolean,
  price: number,
  remainStock: number
): string => {
  if (product && remainStock <= 0) {
    return "SOLD OUT";
  }

  return toLocaleStringKrPrice(price, isAdmin);
};

export const toLocaleStringKrPrice = (price: number, isAdmin: boolean) => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
