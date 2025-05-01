"use client";

import { useState, useEffect } from "react";

type NoticePopupProps = {
  message: string;
  isVisible: boolean;
  isNotice?: boolean;
  onClose: () => void;
};

export default function NoticePopup({ message, isVisible, isNotice = false, onClose }: NoticePopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`font-inter font-semibold fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm p-4 text-sm rounded-lg shadow-lg border-l-4 flex items-center justify-center gap-3 
      transition-transform duration-300 ease-out ${
        show ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      } 
      ${
        isNotice
          ? "bg-[#D96C00] border-[#D96C00] text-white"
          : "bg-[#B91C1C] border-[#B91C1C] text-white"
      }`}
    >
      <span className="text-xl">{isNotice ? "✅" : "⚠️"}</span>
      <p className="text-center whitespace-pre-line">{message}</p>
    </div>
  );
}
