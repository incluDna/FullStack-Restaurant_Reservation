import React, { useState } from "react";
import { Queue } from "../../interfaces";
import { useRouter } from "next/navigation";
import deleteQueue from "@/libs/Queue/deleteQueue";

interface QueueCardInProfileProps {
  que: Queue;
  token: string;
  onDelete: (id?: string) => void;
}

const QueueCardInProfile: React.FC<QueueCardInProfileProps> = ({ que, token, onDelete }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReviewPrompt, setShowReviewPrompt] = useState(que.status === "completed");
  const [hideReviewPrompt, setHideReviewPrompt] = useState(false);

  const addReview = () => {
    router.push(`/restaurants/${que.restaurant._id}/reviews`);
  };

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await deleteQueue(token, que._id!); // เรียกฟังก์ชันลบจาก lib
      onDelete(que._id); // แจ้ง component แม่ว่าลบสำเร็จ
    } catch (err) {
      console.error(err);
      setError("Failed to delete queue.");
    }
    setLoading(false);
  };

  return (
    <li className="bg-[#FFECAD] rounded-lg p-4 shadow-md w-[17vw] max-w-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-1">{que.restaurant.name}</h3>
      <p className="text-sm text-black">Location: {que.restaurant.province}</p>
      <p className="text-sm text-orange-400 mt-2">status: {que.status}</p>

      {showReviewPrompt && (
        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm font-semibold text-gray-700">Review?</span>
          <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800" onClick={addReview}>
            Yes
          </button>
          <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"  onClick={() => setShowReviewPrompt(false)}>
            No
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {(!showReviewPrompt || que.status !== "completed") && (
      <div className="flex justify-start mt-3">
        <button
          className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500"
          onClick={() => onDelete(que._id)}
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove"}
        </button>
      </div>
       )}
    </li>
  );
};

export default QueueCardInProfile;
