"use client"

import { useEffect, useState } from "react";
import ReserveManageCard from "./card/managementComp/ReserveManageCard";
import { Reservation, ReservationJSON } from "../../interfaces";
import getReservationsByRestaurant from "@/libs/getReservationsByRestaurant";
import deleteReservation from "@/libs/deleteReservation";

export default function ReserveManageSection({ token, restaurantID }: { token?: string, restaurantID?: string }) {
    const [reservations, setReservations] = useState<Reservation[] | undefined>(
        undefined,
    );
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // force to fetch
    const [pleaseReload, setPleaseReload] = useState<boolean>(false);

    if (restaurantID == null) return (
        <div className="w-1/2 h-full text-center break-words text-xl font-bold">
            Invalid Restaurant ID
        </div>
    );
    if (token == null) return (
        <div className="w-1/2 h-full text-center break-words text-xl font-bold">
            Please log in first
        </div>
    );


    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response: ReservationJSON = await getReservationsByRestaurant(token, restaurantID);
                setReservations(response.data);
                setLoading(false);
                console.log(reservations);
            } catch (error) {
                console.error("Error fetching reservations:", error);
                setError("Error fetching reservations.");
                setLoading(false);
            }
        };

        fetchReservations();
    }, [pleaseReload]);
    if (error) {
        return <p>{error}</p>;
    }

    const removeFunction = async (reservationId:string) => {
        if (token && token !== null) {
            const res = await deleteReservation(token, reservationId);
            if (res.success) {
                setPleaseReload(!pleaseReload);
            }
        } else {
            alert("No token");
            return;
        }
    };

    return (
        <div className="w-1/2 h-full bg-white p-5 flex flex-col gap-y-5">
            <div className="w-full h-3/2 text-center break-words text-xl font-bold">
                {/* Date: {date} Not sure if we still implement picking date*/}
                Reservation
            </div>
            {
                reservations?.map((reservation) =>
                (
                    <ReserveManageCard
                        key={reservation._id}
                        reserveDate={reservation.resDate}
                        reservationID={reservation._id}
                        userName={reservation.user.name}
                        userTel={reservation.user.tel}
                        seatCount={reservation.seatCount}
                        removeFunction={removeFunction}
                        />

                )
                )
            }
        </div>
    );
}

