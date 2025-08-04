export type Message = {
  type: "error" | "success" | "warning";
  message: string;
};

export type ToastConfig<Type extends string> = {
  cases: Readonly<
    Record<
      Type,
      {
        className: string;
      }
    >
  >;
  defaultDuration: number;
};
