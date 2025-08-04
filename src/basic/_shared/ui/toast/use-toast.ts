import { use } from "react";
import { ToastCommandContext } from "./Provider";

export const useToast = () => {
  return use(ToastCommandContext);
};
