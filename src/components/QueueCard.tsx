import { motion } from "framer-motion";
import { createQueue } from "@/libs/Queue/createQueue";
import { getAuthCookie } from "@/libs/User/getAuthCookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type QueueCardProps = {
  id: string;
};

export default function QueueCard({ id }: QueueCardProps) {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [seatCount, setSeatCount] = useState(0);
  const [error, setError] = useState(""); 
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
    setError("");

    if (seatCount <= 0) {
      setError("Please enter the number of people.");
      return;
    }

    const fieldValues = {
      restaurantId: id,
      token,
      seatCount,
      queueStatus: "waiting"
    };

    const result = await createQueue(fieldValues);

    if (result.success) {
      alert("You are now in line!");
      setTimeout(() => router.push("/profile"), 1000);
    } else {
      setError(result.message);
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
          className={`w-24 h-10 text-base p-2 bg-white border ${
            error ? "border-red-500" : "border"
          }`}
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

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}
    </div>
  );
}
