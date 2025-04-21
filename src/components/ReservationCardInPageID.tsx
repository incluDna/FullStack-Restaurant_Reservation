"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Restaurant, ProfileJSON } from "../../interfaces";
import addReservation from "@/libs/addReservations"; 

interface ReservationCardProps {
  restaurantData: Restaurant;
  token: string | null;
  profile: ProfileJSON | null;
}

export default function ReservationCardInPageID({
  restaurantData,
  token,
  profile,
}: ReservationCardProps) {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  const minDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    if (!restaurantData?.openTime || !restaurantData?.closeTime) return;

    const times: string[] = [];
    const [openHour, openMinute] = restaurantData.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = restaurantData.closeTime.split(":").map(Number);

    const openDate = new Date();
    openDate.setHours(openHour, openMinute, 0, 0);

    const closeDate = new Date();
    closeDate.setHours(closeHour, closeMinute, 0, 0);

    const current = new Date(openDate);

    while (current <= closeDate) {
      times.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + 15);
    }

    setTimeOptions(times);
  }, [restaurantData]);

  const handleReservation = async () => {
    if (!token) {
      alert("User is not authenticated");
      return;
    }

    if (!numberOfPeople || !selectedDate || !selectedTime) {
      alert("Please fill out all fields.");
      return;
    }

    const userId = profile?.data?._id;
    const reservationDateString = `${selectedDate}T${selectedTime}:00.000Z`;
    const reservationDate = new Date(reservationDateString);

    const response = await addReservation(
      token,
      reservationDate,
      userId!,
      restaurantData._id!,
      numberOfPeople
    );

    if (!response.success) {
      setReservationSuccess(false);
      setReservationError(response.message);
    } else {
      setReservationError(null);
      setReservationSuccess(true);
      setTimeout(() => {
        setReservationSuccess(false);
      }, 700);
    }
  };

  return (
    <div className="flex-1 bg-[#ffebac] p-6 flex flex-col justify-between rounded-xl">
      <div className="flex flex-col flex-1 justify-center">
        <div className="grid grid-cols-1 place-items-center gap-4">
          <h2 className="text-2xl font-bold text-black">Reserve Table</h2>

          <div className="flex flex-col items-center gap-2">
            <label className="text-lg text-black">How many people?</label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(Number(e.target.value))}
              className="w-24 h-10 p-2 bg-white border"
              min={1}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <label className="text-lg text-black">Select Date & Time</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              className="w-40 h-10 p-2 text-gray-700 bg-white border"
            />
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-40 h-10 p-2 bg-white border text-gray-700"
            >
              <option value="" disabled hidden>
                - Select Time -
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onClick={handleReservation}
        className="w-full h-10 mt-8 bg-[#f79540] text-white text-lg"
      >
        Reserve
      </motion.button>

      {reservationError && (
        <div className="text-red-500 text-center mt-4">{reservationError}</div>
      )}
      {reservationSuccess && (
        <div className="text-green-500 text-center mt-4">
          Reservation confirmed successfully
        </div>
      )}
    </div>
  );
}
