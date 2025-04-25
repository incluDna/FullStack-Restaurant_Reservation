'use client';
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface QueueActionButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
}

export default function QueueStatusButton({ icon: Icon, onClick }: QueueActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-[#FF7B00] w-[3vw] h-[6vh] flex items-center justify-center"
      whileHover={{ backgroundColor: "#AD9A89" }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={20} color="white" />
    </motion.button>
  );
}
