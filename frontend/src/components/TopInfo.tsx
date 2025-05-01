import React from "react";
import { Restaurant } from "../../interfaces";

export default function TopInfo({
    restaurantData,
    isEditable,
    setRestaurantData,
}: {
    restaurantData: Restaurant;
    isEditable: boolean;
    setRestaurantData: React.Dispatch<React.SetStateAction<Restaurant>>;
}) 
{
    return (
        <section className="flex flex-col lg:flex-row gap-4 px-20 pt-20 pb-10 lg:justify-center">
            <div className="font-inter lg:w-3/5 xl:w-2/5 h-auto items-center justify-center bg-[#3d3c3a] rounded-3xl overflow-hidden">
                {isEditable ? (
                    <input
                        type="text"
                        value={restaurantData.picture}
                        onChange={(e) =>
                            setRestaurantData({
                                ...restaurantData,
                                picture: e.target.value,
                            })
                        }
                        className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                        placeholder="Enter image URL or base64 string"
                    />
                ) : (
                    <img className="w-full h-full object-cover" alt="restaurant" src={restaurantData.picture} />
                )}
            </div>

            <div className="flex flex-col gap-2 flex-1 lg:justify-center">
                <h1 className="font-semibold text-4xl text-black">
                    {isEditable ? (
                        <input
                            type="text"
                            value={restaurantData.name}
                            onChange={(e) =>
                                setRestaurantData({
                                    ...restaurantData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full text-xl text-black border-b-2 border-gray-300 focus:outline-none"
                            placeholder="Restaurant Name"
                        />
                    ) : (
                        restaurantData.name
                    )}
                </h1>

                <div className="font-inter font-semibold text-base lg:text-xl space-y-2 text-black">
                    {/* Address and District */}
                    <div>
                        {isEditable ? (
                            <>
                                <input
                                    type="text"
                                    value={restaurantData.address}
                                    onChange={(e) =>
                                        setRestaurantData({
                                            ...restaurantData,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                    placeholder="Address"
                                />
                                <input
                                    type="text"
                                    value={restaurantData.district}
                                    onChange={(e) =>
                                        setRestaurantData({
                                            ...restaurantData,
                                            district: e.target.value,
                                        })
                                    }
                                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                    placeholder="District"
                                />
                            </>
                        ) : (
                            `${restaurantData.address}, ${restaurantData.district}`
                        )}
                    </div>

                    {/* Province, PostalCode, Region */}
                    <div>
                        {isEditable ? (
                            <>
                                <input
                                    type="text"
                                    value={restaurantData.province}
                                    onChange={(e) =>
                                        setRestaurantData({
                                            ...restaurantData,
                                            province: e.target.value,
                                        })
                                    }
                                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                    placeholder="Province"
                                />
                                <input
                                    type="text"
                                    value={restaurantData.postalCode}
                                    onChange={(e) =>
                                        setRestaurantData({
                                            ...restaurantData,
                                            postalCode: e.target.value,
                                        })
                                    }
                                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                    placeholder="Postal Code"
                                />
                                <input
                                    type="text"
                                    value={restaurantData.region}
                                    onChange={(e) =>
                                        setRestaurantData({
                                            ...restaurantData,
                                            region: e.target.value,
                                        })
                                    }
                                    className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                    placeholder="Region"
                                />
                            </>
                        ) : (
                            `${restaurantData.province} ${restaurantData.postalCode} ${restaurantData.region}`
                        )}
                    </div>

                    {/* Telephone */}
                    <div>
                        {isEditable ? (
                            <input
                                type="text"
                                value={restaurantData.tel}
                                onChange={(e) =>
                                    setRestaurantData({
                                        ...restaurantData,
                                        tel: e.target.value,
                                    })
                                }
                                className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                placeholder="Telephone Number"
                            />
                        ) : (
                            restaurantData.tel
                        )}
                    </div>

                    {/* Open Time and Close Time */}
                    <div className="flex gap-2">
                        {isEditable ? (
                            <>
                                <input
                                    type="time"
                                    value={restaurantData.openTime || ""}
                                    onChange={(e) =>
                                        setRestaurantData({
                                            ...restaurantData,
                                            openTime: e.target.value,
                                        })
                                    }
                                    className="w-1/2 text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                />
                                <input
                                    type="time"
                                    value={restaurantData.closeTime || ""}
                                    onChange={(e) =>
                                        setRestaurantData({
                                            ...restaurantData,
                                            closeTime: e.target.value,
                                        })
                                    }
                                    className="w-1/2 text-base text-black border-b-2 border-gray-300 focus:outline-none"
                                />  
                            </>
                        ) : (
                            <p>
                                {restaurantData.openTime} - {restaurantData.closeTime}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
