import { type Dispatch, type SetStateAction, useState } from "react";

import { useDebounceValue } from "./useDebounceValue";

type UseDebounceStateProps<S> = {
  delay: number;
  initialValue: S;
};

export function useDebounceState<S>({
  delay,
  initialValue
}: UseDebounceStateProps<S>): [S, Dispatch<SetStateAction<S>>, S] {
  const [state, setState] = useState(initialValue);

  const debouncedState = useDebounceValue({
    delay,
    value: state
  });

  return [state, setState, debouncedState];
}
