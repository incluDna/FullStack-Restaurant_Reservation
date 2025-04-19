'use client';

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import addRestaurants from "@/libs/addRestaurant";
import { getAuthCookie } from "@/libs/getAuthCookie";
import { useRouter } from "next/navigation";

export default function CreateRestaurant() {
    const [name, setName] = useState("");
    const [picture, setPicture] = useState("");
    const [address, setAddress] = useState("");
    const [district, setDistrict] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [province, setProvince] = useState("");
    const [region, setRegion] = useState("");
    const [tel, setTel] = useState("");
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [seatPerReservationLimit, setSeatPerReservationLimit] = useState<number>(1);
    const [reservationLimit, setReservationLimit] = useState<number>(1);
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchToken() {
            try {
                const data = await getAuthCookie();
                if (data.success) {
                    setToken(data.token);
                    setRole(data.role || "");
                } else {
                    console.error("Auth error:", data.error);
                }
            } catch (err) {
                console.error("Failed to fetch auth cookie", err);
            }
        }

        fetchToken();
    }, []);

    const handleSubmit = async () => {
        const fieldValues = {
            name : name,
            picture : picture,
            address : address,
            district : district,
            province : province,
            postalCode : postalCode,
            region : region,
            tel : tel,
            openTime : openTime,
            closeTime : closeTime,
            seatPerReservationLimit : seatPerReservationLimit,
            reservationLimit : reservationLimit,
            shortLocation: `${address}, ${district}, ${province}`
        };

        const newErrors: { [key: string]: boolean } = {};
        Object.entries(fieldValues).forEach(([key, value]) => {
            if (value === "" || value === null || value === undefined) newErrors[key] = true;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0 || !token) return;

        try {
            await addRestaurants(token, fieldValues);
            alert("Creation completed!");
            setTimeout(() => router.push("/restaurants"), 1000);
        } catch (err) {
            console.error("Failed to add restaurant:", err);
        }
    };

    const getInputClass = (hasError: boolean) =>
        `text-base text-black border-b-2 focus:outline-none w-full ${hasError ? "border-red-500 placeholder-red-500" : "border-gray-300"
        }`;

    return (
        <div className="w-full border-none py-10 px-16">
            <div className="flex flex-col gap-16 p-8 bg-white">

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={getInputClass(errors.name)}
                    placeholder="Enter restaurant's name"
                />

                <input
                    type="text"
                    value={picture}
                    onChange={(e) => setPicture(e.target.value)}
                    className={getInputClass(errors.picture)}
                    placeholder="Enter image URL"
                />

                <div className="flex gap-16">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={getInputClass(errors.address)}
                        placeholder="Enter address"
                    />
                    <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className={getInputClass(errors.district)}
                        placeholder="Enter district"
                    />
                    <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className={getInputClass(errors.province)}
                        placeholder="Enter province"
                    />
                </div>

                <div className="flex gap-16">
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className={getInputClass(errors.postalCode)}
                        placeholder="Enter postal code"
                    />
                    <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className={getInputClass(errors.region)}
                        placeholder="Enter region"
                    />
                </div>

                <input
                    type="text"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className={getInputClass(errors.tel)}
                    placeholder="Enter telephone"
                />

                <div className="flex gap-16">
                    <input
                        type="time"
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className={getInputClass(errors.openTime)}
                    />
                    <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className={getInputClass(errors.closeTime)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700">
                        Seat per reservation limit
                    </label>
                    <input
                        type="number"
                        value={seatPerReservationLimit}
                        onChange={(e) => setSeatPerReservationLimit(Number(e.target.value))}
                        className={getInputClass(errors.seatPerReservationLimit)}
                        placeholder="e.g., 4"
                        min={1}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700">
                        Reservation limit
                    </label>
                    <input
                        type="number"
                        value={reservationLimit}
                        onChange={(e) => setReservationLimit(Number(e.target.value))}
                        className={getInputClass(errors.reservationLimit)}
                        placeholder="e.g., 20"
                        min={1}
                    />
                </div>
                <div className="flex justify-center">
                    <motion.button
                        whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleSubmit}
                        className="w-fit px-12 h-16 text-2xl font-bold bg-[#f79540] text-white rounded"
                    >
                        Submit
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
