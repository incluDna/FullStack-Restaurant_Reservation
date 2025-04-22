import React from "react";
import { Queue } from "../../interfaces"; 

interface QueueCardInProfileProps {
  res: Queue;
  onDelete: (id?: string) => void;
}

const QueueCardInProfile: React.FC<QueueCardInProfileProps> = ({ res, onDelete }) => {
  return (
    <li className="bg-[#FFECAD] rounded-lg p-4 shadow-md w-[17vw] max-w-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-1">{res.restaurant.name}</h3>
      <p className="text-sm text-black">Location: Fake Location</p>
      <p className="text-sm text-orange-400 mt-2">status: {res.status}</p>

      {/* if status is complete */}
      {res.status === "complete" && (
        <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-semibold text-gray-700">Review?</span>
            <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
            Yes
            </button>
            <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
            No
            </button>
        </div>
        )}


      <div className="flex justify-start mt-3">
        <button
          className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500"
          onClick={() => onDelete(res._id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
};

export default QueueCardInProfile;
