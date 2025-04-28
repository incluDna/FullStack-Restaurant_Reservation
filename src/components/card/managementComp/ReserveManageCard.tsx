"use client"

import Image from "next/image";

export default function ReserveManageCard({ reserveDate, reservationID, userName, userTel, seatCount, removeFunction }
    : { reserveDate: Date, reservationID?: string, userName: string, userTel: string, seatCount: Number, removeFunction: Function}) {
    const futureResColor = '[#FFECAD]';
    const lateResColor = 'gray-100'; // reservation is in the past
    const color = new Date(reserveDate).getTime() >= Date.now() ? futureResColor : lateResColor;
    // new Date() -> local date , reserveDate = UTC (2025-04-20T13:00:00.000Z etc.)
    
    return (
        <div className={`w-full min-h-[200px] h-auto bg-${color} rounded-[30px] drop-shadow-md p-4 flex flex-row`}>
            <div className="grow h-full flex flex-col">
                <div className="text-left text-3xl font-semibold">{reserveDate.toString().slice(0, 10) + ' ' + reserveDate.toString().slice(11, 16)}</div>
                
                <div className="text-left text-lg font-semibold">{userName}</div>
                <div className="text-left text-lg font-semibold">tel: {userTel}</div>
                <div className="text-left text-lg font-semibold">Seats Count: {seatCount.toString()}</div>
                <div className="text-left text-lg">
                    <span className="font-semibold">Reservation ID: </span>{ reservationID}
                </div>
            </div>
            <div className="w-[40px] h-full flex flex-col gap-y-3">
                <div className="cursor-pointer bg-white rounded-[40px] h-[40px] w-[40px] flex justify-center">
                    <Image
                        src="/images/cross.svg"
                        alt=""
                        width={40}
                        height={40}
                        style={{ objectFit: "contain" }}
                        onClick={() => removeFunction(reservationID)}
                    />
                </div>
            </div>
        </div>
    );
}

