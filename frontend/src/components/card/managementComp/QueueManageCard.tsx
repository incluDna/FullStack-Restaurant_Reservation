"use client";
import React, { useEffect, useState } from "react";
import { Queue } from "../../../../interfaces";
import { Bell, Check, X } from "lucide-react";
import QueueStatusButton from "../../button/QueueStatusButton";
import { getAuthCookie } from "@/libs/User/getAuthCookie";

export default function QueueManageCard({ queue, handleCall, handleTick, handleDelete }: { queue: Queue, handleCall:Function, handleTick:Function, handleDelete:Function }) {
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

  
  return (
    <div className="relative bg-white h-[23vh] w-[40vw] flex flex-row rounded-md shadow-md overflow-hidden">
      {/* Optional Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <p className="text-white font-semibold text-lg">Loading...</p>
        </div>
      )}

      {/* User and Queue Info */}
      <div className="w-full h-full px-4 py-4 space-y-2 ">
        <p className="text-2xl font-semibold leading-none">{queue.user.name}</p>
        <p className="text-lg font-semibold leading-none">tel: {queue.user.tel}</p>
        <p className="text-lg font-semibold leading-none">Seats Count: {queue.seatCount}</p>
        <div className="text-left text-lg">
                    <span className="font-semibold">Queue ID: </span>{queue.user?._id}
        </div>
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
