//import React from "react";
import { Toast } from "../../../types";
import { CloseIcon } from "../icons";

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const getBackgroundColor = () => {
    switch (toast.type) {
      case "error":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-600";
      default:
        return "bg-green-600";
    }
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${getBackgroundColor()}`}
    >
      <span className="mr-2">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white hover:text-gray-200"
      >
        <CloseIcon className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
};
