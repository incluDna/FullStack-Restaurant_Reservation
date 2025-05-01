'use client'
import addReviews from "@/libs/Review/addReviews";
import editReview from "@/libs/Review/editReview";
import { Rating, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useNotice } from "./NoticeContext";
import { motion } from "framer-motion";
export default function Reviewform({ token, profile, restaurantID }: { token: string, profile: any, restaurantID?: string }) {
  const router = useRouter()
  const urlParams = useSearchParams();
  const [rid, setRid] = useState<string | undefined>(restaurantID);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const idFromUrl = urlParams.get("id");
    if (idFromUrl) setId(idFromUrl);
  }, [urlParams]);

  const [user, setUser] = useState<string>(profile.data._id);
  const [reviewStar, setReviewStar] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { showNotice } = useNotice();

  const makeReview = async () => {

    if (user && rid && (reviewStar && description)) {
      try {

        const check = await addReviews(
          token, {
          user: user,
          restaurant: rid,
          reviewStar: reviewStar,
          Description: description
        }
        );
        showNotice("Add Review Successfully!", true);
        setErrorMessage('');
        router.push('/profile');
      }
      catch (err) {
        setErrorMessage('Cannot make a review, ' + err);
      }


    } else if (id && (reviewStar || description)) {
      try {
        const res = await editReview(token, id, reviewStar, description);
        showNotice("Review updated", true);
        setErrorMessage('');
        router.push('/profile')
      }
      catch (err) {
        setErrorMessage('Cannot edit review, ' + err);
      }
    } else {
      setErrorMessage("Please fill in fields.");
    }
  };

  return (
    <div className="p-16">
      {id ?
        <div style={{ fontSize: "96px" }}>Edit Review</div>
        :
        <div style={{ fontSize: "96px" }}>New Review</div>
      }

      <div className="text-center">
        <div className="text-left font-bold text-xl mt-8">
          Review Information
        </div>

        <div className="m-3">
          <div className="my-5">
            <div className="text-xl  font-bold pt-5">Review Star</div>
            <Rating
              name="reviewStar"
              value={reviewStar}
              onChange={(e, newValue) => {
                setReviewStar(newValue ?? 0); // เก็บค่า Rating ที่เลือก
              }}
              // precision={0.5}
              style={{ fontSize: '60px' }}
            />
          </div>

          <div className="bg-[#FFECAD] p-5 w-[80%] m-auto ">

            <div className="text-xl font-bold ">Description</div>

            <TextField variant="standard" name="Description" label="Description"
              className=" w-[90%] "
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                console.log(description);
              }}
              multiline
            />

          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="font-serif m-autoblock rounded-md bg-[#f79540] text-white text-lg mt-8 px-3 py-2"
        onClick={makeReview}
      >
        Submit
      </motion.button>
      <div className="text-red-500 font-mono p-5">{errorMessage}</div>
    </div>
  );

}