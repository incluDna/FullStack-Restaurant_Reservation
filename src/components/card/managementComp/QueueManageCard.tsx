"use client";
import React, { useEffect, useState } from "react";
import { Queue } from "../../../../interfaces";
import { Bell, Check, X } from "lucide-react";
import QueueStatusButton from "../../button/QueueStatusButton";
import callQueue from "@/libs/Queue/callQueue";
import { getAuthCookie } from "@/libs/User/getAuthCookie";
import tickQueue from "@/libs/Queue/tickQueue";
import deleteQueue from "@/libs/Queue/deleteQueue";

export default function QueueManageCard({ queue }: { queue: Queue }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAuthCookie();
        setToken(data.token);
      } catch (error) {
        console.log("Auth error: ", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCall = async (queueId: string) => {
    setLoading(true);
    try {
      await callQueue(token, queueId);
    } catch (error) {
      console.log("Call error: ", error);
      alert("Cannot call the selected queue at this moment. Please try again.");
    }
    setLoading(false);
  };

  const handleTick = async (queueId: string) => {
    setLoading(true);
    try {
      await tickQueue(token, queueId);
    } catch (error) {
      console.log("Tick error: ", error);
      alert("Cannot confirm the selected queue at this moment. Please try again.");
    }
    setLoading(false);
  };

  const handleDelete = async (queueId: string) => {
    setLoading(true);
    try {
      await deleteQueue(token, queueId);
    } catch (error) {
      console.log("Delete error: ", error);
      alert("Cannot cancel the selected queue at this moment. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative bg-[#C2C2C2] h-[23vh] w-[40vw] flex flex-row rounded-md shadow-md overflow-hidden">
      {/* Optional Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <p className="text-white font-semibold text-lg">Loading...</p>
        </div>
      )}

      {/* User and Queue Info */}
      <div className="w-full h-full px-4 py-4 space-y-2 font-inter">
        <p>{queue.user._id}</p>
        <p>{queue.user.name}</p>
        <p>{queue.user.tel}</p>
        <p>Number of People: {queue.seatCount}</p>
      </div>

      {/* Buttons */}
      <div className="w-[5vw] h-full py-2 space-y-2 flex flex-col justify-center items-center z-0">
        <QueueStatusButton icon={Bell} onClick={() => handleCall(queue._id!)} disabled={loading} />
        <QueueStatusButton icon={Check} onClick={() => handleTick(queue._id!)} disabled={loading} />
        <QueueStatusButton icon={X} onClick={() => handleDelete(queue._id!)} disabled={loading} />
      </div>
    </div>
  );
}
