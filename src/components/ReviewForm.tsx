'use client'
import addReviews from "@/libs/Review/addReviews";
import editReview from "@/libs/Review/editReview";
import { Rating, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



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
        alert("Add Review Successfully!");
        setErrorMessage('');
        router.push('/profile');
      }
      catch (err) {
        setErrorMessage('Cannot make a review, ' + err);
      }


    } else if (id && (reviewStar || description)) {
      try {
        const res = await editReview(token, id, reviewStar, description);
        alert("Review updated ");
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
    <div className="p-3 ">
      {id ?
        <div style={{ fontSize: "96px" }}>Edit Review</div>
        :
        <div style={{ fontSize: "96px" }}>New Review</div>
      }

      <div className="text-center">
        <div className="text-left font-bold text-xl">
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
      <button
        className="font-serif m-autoblock rounded-md bg-[#F89640] 
        hover:bg-green-600 px-3 py-2 text-white shadow-sm"
        onClick={makeReview}
      >
        Submit
      </button>
      <div className="text-red-500 font-mono p-5">{errorMessage}</div>
    </div>
  );

}