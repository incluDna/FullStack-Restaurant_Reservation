import React, { useState } from "react";
import { Reservation } from "../../interfaces";
import editReservation from "@/libs/Reservation/editReservation";
import deleteReservation from "@/libs/Reservation/deleteReservation";

interface ReservationCardProps {
  res: Reservation;
  index: number;
  token: string;
  onUpdate: (index: number, updated: Reservation) => void;
  onDelete: (id?: string) => void;
}

export default function ReservationCard({
  res,
  index,
  token,
  onUpdate,
  onDelete,
}: ReservationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const resDate = new Date(res.resDate);

  const [editData, setEditData] = useState({
    resDate: resDate.toISOString().slice(0, 10),
    resTime: resDate.toTimeString().slice(0, 5),
    seatCount: res.seatCount.toString(),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    const { resDate, resTime, seatCount } = editData;
  
    if (!seatCount || isNaN(Number(seatCount)) || Number(seatCount) <= 0) {
      setError("Seats must be a positive number.");
      setLoading(false);
      return;
    }
  
    // Check if the time is in increments of 15 minutes
    const [hours, minutes] = resTime.split(":").map((str) => parseInt(str, 10));
    if (minutes % 15 !== 0) {
      setError("Time must be in 15-minute intervals (e.g., 00, 15, 30, or 45).");
      setLoading(false);
      return;
    }
  
    const isDateChanged =
      res.resDate.toString().slice(0, 10) !== resDate ||
      res.resDate.toString().slice(11, 16) !== resTime;
    if (isDateChanged && (!resDate || !resTime)) {
      setError("Invalid date/time.");
      setLoading(false);
      return;
    }
  
    try {
      setError("");
      const newDate = new Date(`${resDate}T${resTime}:00`);
      await editReservation(
        token,
        res._id!,
        isDateChanged ? newDate : undefined,
        seatCount !== res.seatCount.toString() ? parseInt(seatCount) : undefined
      );
  
      const updatedReservation: Reservation = {
        ...res,
        ...(isDateChanged ? { resDate: newDate } : {}),
        ...(seatCount !== res.seatCount.toString()
          ? { seatCount: parseInt(seatCount) }
          : {}),
      };
  
      onUpdate(index, updatedReservation);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("Invalid time")) {
        setError("The time you selected is outside the restaurant's operating hours.");
      } else if (err.message.includes("seat count exceeds the limit")) {
        setError("The seat count exceeds the limit of 6. Please choose fewer seats.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  
    setLoading(false);
  };  

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await deleteReservation(token, res._id!);
      onDelete(res._id);
    } catch (err) {
      console.error(err);
      setError("Failed to delete reservation.");
    }
    setLoading(false);
  };

  return (
    <li className="bg-[#FFECAD] rounded-lg p-4 shadow-md min-w-[17vw] w-fit">
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="date"
              value={editData.resDate}
              onChange={(e) => handleEditChange("resDate", e.target.value)}
              className="w-1/2 px-3 py-2 border rounded"
            />
            <input
              type="time"
              value={editData.resTime}
              onChange={(e) => handleEditChange("resTime", e.target.value)}
              className="w-1/2 px-3 py-2 border rounded"
            />
          </div>
          <input
            type="number"
            value={editData.seatCount}
            onChange={(e) => handleEditChange("seatCount", e.target.value)}
            className="w-full px-3 py-2 border rounded"
            min={1}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2 mt-2">
            <button
              className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              onClick={() => {
                setIsEditing(false);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {res.restaurant.name}
          </h3>
          <p className="text-sm text-black">Location: {res.restaurant.province}</p>
          <p className="text-sm text-black">
            {resDate.toLocaleDateString("en-CA")} —{" "}
            {resDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-sm text-black">
            Number of seats: {res.seatCount}
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2 mt-3">
            <button
              className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Canceling..." : "Cancel"}
            </button>
          </div>
        </>
      )}
    </li>
  );
}
