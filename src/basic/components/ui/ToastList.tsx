//import React from "react";
import { Toast } from "../../../types";
import { ToastItem } from "./ToastItem";

interface ToastListProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastList = ({ toasts, onClose }: ToastListProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
