"use client";
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface QueueActionButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
}

export default function QueueStatusButton({
  icon: Icon,
  onClick,
  disabled = false,
}: QueueActionButtonProps) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      className={`w-[3vw] h-[6vh] flex items-center justify-center rounded-md
        ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF7B00] hover:bg-[#AD9A89]"}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      transition={{ duration: 0.3 }}
      disabled={disabled}
    >
      <Icon size={20} color="white" />
    </motion.button>
  );
}
