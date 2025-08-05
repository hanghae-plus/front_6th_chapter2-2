import { Message, useToast } from "../../_shared/ui/toast";
import { useAutoCallback } from "../../_shared/utility-hooks/use-auto-callback";

export const useNotification = () => {
  const { show } = useToast();

  const addNotification = useAutoCallback((message: Omit<Message, "id">) => {
    show(message, { duration: 3000 });
  });

  return {
    addNotification,
  };
};
