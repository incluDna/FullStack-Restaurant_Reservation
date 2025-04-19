'use client'

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import addRestaurants from "@/libs/addRestaurant";
import { getAuthCookie } from "@/libs/getAuthCookie";
import { useRouter } from "next/navigation";

export default function CreateRestaurant() {
    const [name, setName] = useState<string>("");
    const [picture, setPicture] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [postalCode, setPostalCode] = useState<string>("");
    const [province, setProvince] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    const [tel, setTel] = useState<string>("");
    const [openTime, setOpenTime] = useState<string>("");
    const [closeTime, setCloseTime] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchToken() {
            try {
                const data = await getAuthCookie();
                if (data.success) {
                    setToken(data.token);
                    setRole(data.role || null);
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
        const fieldValues = { name, picture, address, district, province, postalCode, region, tel, openTime, closeTime };
        const newErrors: { [key: string]: boolean } = {};

        Object.entries(fieldValues).forEach(([key, value]) => {
            if (!value) newErrors[key] = true;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0 || !token) return;

        const newRestaurant = {
            name,
            picture,
            address,
            district,
            province,
            postalCode,
            region,
            shortLocation: `${address}, ${district}, ${province}`,
            tel,
            openTime,
            closeTime,
        };

        try {
            await addRestaurants(token, newRestaurant);
            setSuccess(true);
            setTimeout(() => {
                router.push("/restaurants");
            }, 2000);
        } catch (err) {
            console.error("Failed to add restaurant:", err);
        }
    };

    const getInputClass = (hasError: boolean) =>
        `text-base text-black border-b-2 focus:outline-none w-full ${
            hasError ? "border-red-500 placeholder-red-500" : "border-gray-300"
        }`;

    return (
        <div className="w-full border-none py-10 px-16">
            <div className="flex flex-col gap-16 p-8 bg-white">
                {success && (
                    <p className="text-green-500 font-bold text-lg text-center">
                        Create successful!
                    </p>
                )}

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={getInputClass(errors.name)}
                    placeholder={errors.name ? "Enter restaurant's name" : "Enter restaurant's name"}
                />

                <input
                    type="text"
                    value={picture}
                    onChange={(e) => setPicture(e.target.value)}
                    className={getInputClass(errors.picture)}
                    placeholder={errors.picture ? "Enter image URL" : "Enter image URL"}
                />

                <div className="flex gap-16">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={getInputClass(errors.address)}
                        placeholder={errors.address ? "Enter address" : "Enter address"}
                    />
                    <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className={getInputClass(errors.district)}
                        placeholder={errors.district ? "Enter district" : "Enter district"}
                    />
                    <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className={getInputClass(errors.province)}
                        placeholder={errors.province ? "Enter province" : "Enter province"}
                    />
                </div>

                <div className="flex gap-16">
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className={getInputClass(errors.postalCode)}
                        placeholder={errors.postalCode ? "Enter postal code" : "Enter postal code"}
                    />
                    <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className={getInputClass(errors.region)}
                        placeholder={errors.region ? "Enter region" : "Enter region"}
                    />
                </div>

                <input
                    type="text"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className={getInputClass(errors.tel)}
                    placeholder={errors.tel ? "Enter telephone" : "Enter telephone"}
                />

                <div className="flex gap-16">
                    <input
                        type="time"
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className={getInputClass(errors.openTime)}
                        placeholder=""
                    />
                    <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className={getInputClass(errors.closeTime)}
                        placeholder=""
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
