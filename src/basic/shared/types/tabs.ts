import type { ReactNode } from "react";

export type TabItem<T extends string = string> = {
  id: T;
  label: string;
  content: ReactNode;
};

export type TabConfig<T extends string = string> = {
  tabs: TabItem<T>[];
  defaultTab: T;
};
