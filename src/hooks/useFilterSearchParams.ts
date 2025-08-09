import React from "react";
import { z } from "zod";
import { useSearchParams } from "./useSearchParams";

const filterSearchParamsSchema = z.object({
  searchTerm: z.string().optional(),
});

export type filterSearchParamsSchemaType = z.infer<
  typeof filterSearchParamsSchema
>;

/**
 * searchParams를 Order requestType에 맞는 타입으로 변환해서 return
 */
export default function useFilterSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterSearchParams: filterSearchParamsSchemaType = React.useMemo(() => {
    // URLSearchParams를 일반 객체로 변환
    const paramsObject = Object.fromEntries(searchParams.entries());
    const validSearchParams = filterSearchParamsSchema.safeParse(paramsObject);

    if (!validSearchParams.success) {
      return {
        searchTerm: "",
      };
    }

    return {
      ...validSearchParams.data,
    };
  }, [searchParams]);

  const setFilterSearchParams = (
    value: Partial<filterSearchParamsSchemaType>
  ) => {
    const newSearchParams = {
      ...filterSearchParams,
      ...value,
    };

    // 빈 값들은 제거하고 URL에 설정
    const filteredParams = Object.fromEntries(
      Object.entries(newSearchParams).filter(
        ([_, v]) => v !== "" && v !== undefined
      )
    );

    setSearchParams(filteredParams);
  };

  return { filterSearchParams, setFilterSearchParams };
}
