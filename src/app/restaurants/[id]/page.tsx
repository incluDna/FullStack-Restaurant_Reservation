'use client';
import { motion } from "framer-motion";
import { ChevronRight, Star } from "lucide-react";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import getRestaurant from "@/libs/getRestaurant";
import getReviewForRestaurant from "@/libs/getReviewForRestaurant";
import getMeanReviews from "@/libs/getMeanReview";
import addReservation from "@/libs/addReservations";
import { MeanReview, RestaurantJSON, Review, ReviewJSON } from "../../../../interfaces";
import { LinearProgress } from "@mui/material";
import ReviewCatalogExample from "@/components/ReviewCatalogExample";
export default function RestaurantInfo() {
  // const session = await getServerSession(authOptions);
  const token =
    // session.user.token;
    // uncomment all above and delete line below when login/register is implemented  
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjY4ZDQ0NjdiOTY0ZWRkNTQ2NzEyOCIsImlhdCI6MTc0NDY4NzA3NiwiZXhwIjoxNzQ3Mjc5MDc2fQ.Nt7Q3fBbw3v4fxVjXR2LlsrjHwBrpxarATwRELfm3Uc';
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<Review[] | null>(null);
  const [meanReview, setMeanReview] = useState<number>(0);
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const restaurantResponse:RestaurantJSON = await getRestaurant(id);
        const reviewResponse:ReviewJSON = await getReviewForRestaurant(id);
        const meanReviewResponse:MeanReview = await getMeanReviews(id);

        setRestaurantData(restaurantResponse.data);
        setReviewData(reviewResponse.data);
        console.log(reviewResponse.count);
        setMeanReview(meanReviewResponse.totalRating || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  useEffect(() => {
    // Generate valid time options (00, 15, 30, 45 minutes)
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const time = new Date();
        time.setHours(hour);
        time.setMinutes(minute);
        const timeString = time.toTimeString().slice(0, 5); // Format as HH:mm
        times.push(timeString);
      }
    }
    setTimeOptions(times);
  }, []);

  const handleReservation = () => {
    if (!numberOfPeople || !selectedDate || !selectedTime) {
      alert("Please fill out all fields.");
      return;
    }
    const reservationDateString = `${selectedDate}T${selectedTime}:00.000Z`;
    console.log(reservationDateString);  // Check what the resulting string looks like
    
    const reservationDate = new Date(reservationDateString);
    console.log(reservationDate);  // Verify the resulting Date object
    addReservation(token, reservationDate, "67f68d4467b964edd5467128", id!, numberOfPeople); //DONT FORGET
  };


  if (!restaurantData || !reviewData) {
    return <div>Loading...</div>;
  }

  // const renderStars = (rating: number) => {
  //   return Array(5)
  //     .fill(0)
  //     .map((_, i) => (
  //       <Star
  //         key={i}
  //         className={`w-6 h-6 ${i < Math.round(rating)
  //           ? "fill-[#f79540] text-[#f79540]"
  //           : "text-gray-300"
  //           }`}
  //       />
  //     ));
  // };

  const totalReviews = reviewData.length;

  return (
    <main className="w-full bg-white">
      <section className="flex flex-col lg:flex-row h-auto lg:h-[450px] gap-6 lg:gap-16 w-full p-4 lg:p-12">
        {/* Restaurant image */}
        <div className="flex w-full lg:w-[450px] h-[250px] lg:h-[450px] items-center justify-center bg-[#3d3c3a]">
          <img
            className="w-full h-full object-cover"
            alt="restaurant"
            src={restaurantData.picture}
          />
        </div>

        {/* Restaurant information */}
        <div className="flex flex-col gap-4 flex-1 space-y-8">
          <h1 className="font-medium text-black text-[40px] sm:text-[70px] lg:text-[110px] leading-tight">
            {restaurantData.name}
          </h1>

          <div className="flex flex-col md:flex-row w-full gap-8">
            <div className="flex-1 font-medium text-black text-xl sm:text-3xl lg:text-[40px] leading-snug space-y-4">
              <div>{restaurantData.address}, {restaurantData.district}</div>
              <div>{restaurantData.province} {restaurantData.postalCode} {restaurantData.region}</div>
              <div>{restaurantData.tel}</div>
              <div>{restaurantData.openTime} - {restaurantData.closeTime}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Queue and Reservation Section */}
      <section className="flex flex-col lg:flex-row w-full justify-center gap-8 py-24 px-8 lg:px-12">
        {/* Get Queue Card */}
        <div className="flex-1 bg-[#ffebac] p-6 lg:p-12 space-y-20 flex flex-col justify-between">
          <h2 className="font-medium text-black text-4xl sm:text-6xl lg:text-9xl mb-6 text-center mt-8">
            Get queue
          </h2>

          <div className="flex flex-col gap-14 items-center">
            <label className="font-medium text-black text-2xl sm:text-3xl lg:text-[40px] text-center">
              How many people?
            </label>
            <input
              type="number"
              className="w-full max-w-[200px] h-[60px] text-xl p-2 bg-white border"
            />
          </div>

          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[400px] h-[80px] bg-[#f79540] hover:bg-[#f79540]/90"
            >
              <span className="font-medium text-white text-3xl lg:text-[40px]">
                get in line
              </span>
            </motion.button>
          </div>
        </div>

        {/* Reserve Table Card */}
        <div className="flex-1 bg-[#ffebac] p-6 lg:p-12 space-y-20 flex flex-col justify-between">
          <h2 className="font-medium text-black text-4xl sm:text-6xl lg:text-9xl mb-6 mt-8 text-center">
            Reserve table
          </h2>


          <div className="flex flex-col gap-8 items-center">
            {/* Number of people */}
            <div className="flex flex-col gap-8 items-center">
              <label className="font-medium text-black text-2xl sm:text-3xl lg:text-[40px] text-center">
                How many people?
              </label>
              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                className="w-full max-w-[200px] h-[60px] p-2 bg-white border text-2xl"
              />
            </div>

            {/* Date and time */}
            <div className="flex flex-col gap-8 items-center">
              <label className="font-medium text-black text-2xl sm:text-3xl lg:text-[40px] text-center">
                Select Date and Time
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full max-w-[250px] h-[60px] p-2 bg-white border text-2xl"
              />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full max-w-[250px] h-[60px] p-2 bg-white border text-2xl"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Reserve button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={handleReservation}
                className="w-full max-w-[400px] h-[80px] bg-[#f79540]"
              >
                <span className="font-medium text-white text-3xl lg:text-[40px]">
                  reserve
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section className="flex flex-col gap-6 px-4 lg:px-12 pb-12">
        <h2 className="font-medium text-black text-[40px] sm:text-[70px] lg:text-[110px] mb-10">
          Reviews Ratings
        </h2>
        <Suspense fallback={<p>Loading ...<LinearProgress /></p>}>
          <ReviewCatalogExample reviews={reviewData} meanReviews={meanReview} />
        </Suspense>

        {/* <div className="flex flex-col sm:flex-row justify-between items-start gap-4 py-6 px-4 sm:px-8 bg-[#ffebac] w-full">
          <div className="flex items-center gap-6">
            <div className="text-[30px] sm:text-[40px] font-medium">
              <span className="text-black">{meanReview}</span>
              <span className="text-[#f79540] text-[25px]">/5.0</span>
            </div>
            <div className="flex">
              {renderStars(meanReview)}
            </div>
          </div>
          <div className="font-medium text-black text-[30px] sm:text-[40px]">
            from {totalReviews} reviews
          </div>
        </div>

        {reviewData.length > 0 && (
          <div className="flex flex-wrap gap-8 w-full">
            {reviewData.map((review: any) => (
              <div
                key={review._id}
                className="w-full md:w-[48%] bg-[#ffebac] p-6 space-y-5 "
              >
                <h3 className="font-medium text-black text-2xl sm:text-[30px]">
                  User: {review.user}
                </h3>
                <div className="flex">
                  {renderStars(review.reviewStar)}
                </div>
                <p className="font-medium text-black text-base sm:text-lg whitespace-pre-line">
                  comment: "{review.reviewText}"
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex justify-end pr-4 sm:pr-8 pt-4">
          <motion.button
            whileHover={{ backgroundColor: "#f79540", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 px-6 py-2 bg-[#ffebac] hover:bg-[#ffebac]/90 text-black rounded-full"
          >
            <span className="font-medium text-xl sm:text-2xl">see more ..</span>
            <ChevronRight className="w-6 h-6 sm:w-[50px] sm:h-[50px]" />
          </motion.button>
        </div> */}
      </section>
    </main>
  );
}
