import { Message, useToast } from "../../_shared/ui/toast";
import { useAutoCallback } from "../../_shared/utility-hooks/use-auto-callback";
import { NotificationType } from "./NotificationProvider";

export const useNotification = () => {
  const { show } = useToast();

  const addNotification = useAutoCallback((message: Message<NotificationType>) => {
    show(message, { duration: 3000 });
  });

  return {
    addNotification,
  };
};
