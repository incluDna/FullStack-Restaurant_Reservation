'use client'
import addReviews from "@/libs/addReviews";
import editReview from "@/libs/editReview";
import { Rating, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export default   function Reviewform({ token,profile}: { token: string  ,profile:any}) {
  const router = useRouter()
  const urlParams = useSearchParams();
  const [rid, setRid] = useState<string>("");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const idFromUrl = urlParams.get("rid");
    if (idFromUrl) setRid(idFromUrl);
  }, [urlParams]); 

  useEffect(() => {
    const idFromUrl = urlParams.get("id");
    if (idFromUrl) setId(idFromUrl);
  }, [urlParams]); 

  const [user, setUser] = useState<string>(profile.data._id);
  const [reviewStar, setReviewStar] = useState<number>(0);
  const [Description, setDescription] = useState<string>('');
  const [errorMessage,setErrorMessage]=useState<string>('');

  const makeReview=async  () => {
    // console.log(session.user.token)
    // console.log(user)
    // console.log(rid)
    // console.log(reviewStar)
    // console.log(Description)

    if (user && rid && (reviewStar&&Description)) {

      const check=await addReviews(
        token,{
            user: user,
            restaurant: rid,
            reviewStar: reviewStar,
            Description: Description
        }
      );
      if(!check){
        setErrorMessage("Cannot make a review.");
        return;
      }

      alert("Add Review Successfully!");
      setErrorMessage('');
      router.push(`/profile`);

      
    }else if(id && (reviewStar||Description)){
      // console.log(reviewStar)
      // console.log(Description)
      
      const check=await editReview(token, id, reviewStar,Description);
      if(!check){
        setErrorMessage("Cannot updated a review.");
        return;
      }
      alert("Review updated ");
      setErrorMessage('');
      router.push('/profile')

    }else{
      setErrorMessage("Please fill in fields.");
    }
  };

  return (
    <div className="p-3 ">
        {id?
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
                  setReviewStar(newValue??0); // เก็บค่า Rating ที่เลือก
              }}
              // precision={0.5}
              style={{ fontSize: '60px' }}
              />
            </div>

            <div className="bg-[#FFECAD] p-5 w-[80%] m-auto ">

              <div className="text-xl font-bold ">Description</div>
              
              <TextField variant="standard" name="Description" label="Description"
              className=" w-[90%] "
              value={Description}
              onChange={(e) => {
                  setDescription(e.target.value );
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