import React, { useEffect, useState } from "react";
import { Queue } from "../../interfaces";
import { useRouter } from "next/navigation";
import deleteQueue from "@/libs/Queue/deleteQueue";
import getQueuePosition from "@/libs/Queue/getQueuePosition";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Image from "next/image";

interface QueueCardInProfileProps {
  que: Queue;
  token: string | null;
  restaurantId: string;
  queueId: string;
  onDelete: (id?: string) => void;
}

export default function QueueCardInProfile({que, tokenRecieve, onDelete, restaurantId, queueId} : {que: Queue, tokenRecieve: string, onDelete: Function, restaurantId: string, queueId: string })
{
  const router = useRouter();
  const [token, setToken] = useState(tokenRecieve);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(que.queueStatus === "completed");

  const nowNotiQueue = useSelector((state: RootState) => state.queueId);
  const notiStatus = useSelector((state: RootState) => state.notiStatus);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const pos = await getQueuePosition(token, restaurantId, queueId);
        setPosition(pos);
        setShowReviewPrompt(que.queueStatus === "completed");
      } catch (err) {
        console.error("Error fetching position:", err);
        setPosition(null);
      }
    };
    fetchPosition();
  }, [token, restaurantId, queueId, que]);

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      await deleteQueue(token, que._id!);
      onDelete(que._id);
      
    } catch (err) {
      console.error(err);
      setError("Failed to delete queue.");
    }
    setLoading(false);
  };

  const addReview = () => {
    router.push(`/restaurants/${que.restaurant._id}/reviews/new`);
  };

  return (
    <li className="bg-[#FFECAD] relative rounded-lg p-4 shadow-md min-w-[17vw] w-fit ">
      {/* Add by Notification Dev*/}
      {que._id === nowNotiQueue && notiStatus !== 0 && (
      <div className={`absolute right-3 up-0 w-fit h-fit rounded-full p-1 bg-orange-400`}>
        <Image
          src="/images/notification.svg"
          alt="i"
          width={20}
          height={20}
        />
      </div>
      )}

      <h3 className="text-xl font-bold text-gray-800 mb-1">{que.restaurant.name}</h3>
      <p className="text-sm text-black">
        Location: {que.restaurant.province}
      </p>
      <p className="text-sm text-black">
        Number of seats: {que.seatCount}
      </p>

      <p className="text-sm text-orange-400 mt-1">
        status: {que.queueStatus}
        {que.queueStatus === "waiting" ? (
    position !== null ? ` for ${position} queue(s)` : "Loading position..."
  ) : ""}
      </p>

      {showReviewPrompt && (
        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm font-semibold text-gray-700">Review?</span>
          <button
            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
            onClick={addReview}
          >
            Yes
          </button>
          <button
            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
            onClick={() => setShowReviewPrompt(false)}
          >
            No
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {!showReviewPrompt && (
        <div className="flex justify-start mt-3">
          <button
            className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500"
            onClick={handleDelete}
            disabled={loading}
          >
            {que.queueStatus!='completed' && (loading ? "Canceling..." : "Cancel")}
            {que.queueStatus==='completed' && (loading ? "Removing..." : "Remove")}
          </button>
        </div>
      )}
    </li>
  );
};


