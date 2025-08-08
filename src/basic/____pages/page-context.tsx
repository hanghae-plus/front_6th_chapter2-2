import { createContext, useContext, useState } from "react";

export const Page = {
  Admin: "admin",
  Shop: "shop",
} as const;

export type Page = (typeof Page)[keyof typeof Page];

export const PageContext = createContext<{
  currentPage: Page;
  moveTo: (page: Page) => void;
}>({
  currentPage: Page.Shop,
  moveTo: () => {},
});

export const usePage = () => {
  const { currentPage, moveTo } = useContext(PageContext);

  return { currentPage, moveTo };
};
