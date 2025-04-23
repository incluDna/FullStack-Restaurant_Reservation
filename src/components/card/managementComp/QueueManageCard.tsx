"use client";
import React, { useEffect, useState } from "react";
import { Queue } from "../../../../interfaces";
import { Bell, Check, X } from "lucide-react";
import QueueStatusButton from "../../button/QueueStatusButton";

export default function QueueManageCard({ queue }: { queue: Queue }) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = (status: string) => {
    setLoading(true);
    try {
      // editQueue(... , status)
      // เอาไว้แก้ status ของ Queue อ่ะ
      // ไม่แน่ใจ syntax อ่ะเอาจริง ๆ อย่าเชื่อ param ที่เขียนนะ ;-;
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // deleteQueue()
      // เอาไว้ deleteQueue นับ params แล้วแต่เหมือนเดิมเลยว่าต้องใช้อะไรบ้าง
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    // สำหรับเรื่องสียังเอาตาม Figma อยู่นะ ไม่ได้แก้อะไร แต่ถ้าอยากให้แก้เดี๋ยวมาแก้ให้ ้ ้ ้
    <div className="bg-[#C2C2C2] h-[23vh] w-[40vw] flex flex-row">
      {/* User's and Queue's Info */}
      <div className="w-full h-full px-4 py-4 space-y-2 font-inter">
        <p>{queue.user._id}</p>
        <p>{queue.user.name}</p>
        <p>{queue.user.tel}</p>
        <p>Number of People: {queue.seatCount}</p>
      </div>

      {/* Buttons */}
      <div className="w-[5vw] h-full py-2 space-y-2 flex flex-col justify-center items-center">
        <QueueStatusButton icon={Bell} onClick={() => handleClick("calling")} />
        <QueueStatusButton
          icon={Check}
          onClick={() => handleClick("complete")}
        />
        <QueueStatusButton icon={X} onClick={() => handleDelete()} />
      </div>
    </div>
  );
}
