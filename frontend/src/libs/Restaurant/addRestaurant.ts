export default async function addRestaurants(
    token: string,
    {
      name,
      address,
      district,
      province,
      postalCode,
      shortLocation,
      tel,
      region,
      openTime,
      closeTime,
      picture,
      seatPerReservationLimit,
      reservationLimit,
    }: {
      name: string;
      address: string;
      district: string;
      province: string;
      postalCode: string;
      shortLocation: string;
      tel: string;
      region: string;
      openTime: string;
      closeTime: string;
      picture: string;
      seatPerReservationLimit: number;
      reservationLimit: number;
    }
  ) {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          address,
          district,
          province,
          postalCode,
          shortLocation,
          tel,
          region,
          openTime,
          closeTime,
          picture,
          seatPerReservationLimit,
          reservationLimit,
        }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        return { success: false, message: errorDetails.message || "Failed to add the restaurant" };
      }
  

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error while adding restaurant:", error);
      return { success: false, message: "An error occurred while adding the restaurant" };
    }
  }
  