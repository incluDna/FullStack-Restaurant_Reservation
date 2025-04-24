import { motion } from "framer-motion";
import { createQueue } from "@/libs/Queue/createQueue";
import { getAuthCookie } from "@/libs/User/getAuthCookie";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

type QueueCardProps = {
  id: string;
};

export default function QueueCard({ id }: QueueCardProps) {
  
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [seatCount, setSeatCount] = useState(0)
  const router = useRouter();
  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await getAuthCookie();
        if (data.success) {
          setToken(data.token);
          setRole(data.role || "");
        } else {
          console.error("Auth error:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch auth cookie", err);
      }
    }

    fetchToken();
  }, []);

  const handleGetQueue = async () => {
    const fieldValues = {
      restaurantId: id!,
      token: token,
      seatCount: seatCount,
      queueStatus: "waiting"
    };


    try {
      await createQueue(fieldValues);
      alert("Creation completed!");
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      console.error("Failed to add restaurant:", err);
    }
  };
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
          onChange={(e) => setSeatCount(Number(e.target.value))}
        />
      </div>
      <motion.button
        whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="w-full h-10 bg-[#f79540] text-white text-lg mt-6"
        onClick={handleGetQueue}
      >
        Get in Line
      </motion.button>
    </div>
  );
}
