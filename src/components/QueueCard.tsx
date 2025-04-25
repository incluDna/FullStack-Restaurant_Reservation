import { motion } from "framer-motion";

export default function QueueCard() {
  return (
    <div className="flex-1 bg-[#ffebac] p-6 flex flex-col justify-center rounded-xl">
      <h2 className="text-2xl font-bold text-center text-black mb-6">
        Get Queue
      </h2>
      <div className="flex flex-col items-center justify-center flex-grow gap-4">
        <label className="text-lg text-black">How many people?</label>
        <input
          type="number"
          className="w-24 h-10 text-base p-2 bg-white border"
        />
      </div>
      <motion.button
        whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="w-full h-10 bg-[#f79540] text-white text-lg mt-6"
      >
        Get in Line
      </motion.button>
    </div>
  );
}
