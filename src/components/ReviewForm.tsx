'use client'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import addReviews from "@/libs/addReviews";
import editReview from "@/libs/editReview";
import getUserProfile from "@/libs/getUserProfile";
import { Rating, TextField } from "@mui/material";
import { getServerSession, Session } from "next-auth";
import { Pattaya } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const pattaya = Pattaya({ weight: "400", subsets: ["thai", "latin"] }); 


export default   function Reviewform({ session,profile}: { session: Session  ,profile:any}) {
          
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

  const makeReview= () => {
    console.log(session.user.token)
    console.log(user)
    console.log(rid)
    console.log(reviewStar)
    console.log(Description)
    if (user && rid && reviewStar&&Description) {

        addReviews(
        
        session.user.token,{
            user: user,
            restaurant: rid,
            reviewStar: reviewStar,
            Description: Description
        }
        
      );
      alert("Add Review Successfully!");

      
    }else if(id){
        
        const reviewData = {
            ...(reviewStar && { reviewStar }),
            ...(Description && { Description })
          };
            editReview(session.user.token, id, reviewData);
          alert("Review updated ");
    }
  };

  return (
    <main className="w-[100%] flex flex-col items-center space-y-4">
        {id?
        <div className={pattaya.className} style={{ fontSize: "96px" }}>Edit Review</div>
        :
        <div className={pattaya.className} style={{ fontSize: "96px" }}>New Review</div>
        }
      
      

      <div className="w-[50%] space-y-2 bg-yellow-50 p-5 rounded-xl border border-green-600">
        <div className="font-serif text-lg text-md text-left text-gray-600">
        Review Information
        </div>
        <div>
            
            
            <div className="flex flex-col ">
                <div className="flex flex-row px-2">
                <div className="w-[30%]">Review Star:</div>
                <Rating
                name="reviewStar"
                value={reviewStar}
                onChange={(e, newValue) => {
                    setReviewStar(newValue??0); // เก็บค่า Rating ที่เลือก
                }}
                />
                </div>
                <div className="flex flex-row px-2">
                <div className="w-[30%]">Description:</div>
                
                <TextField variant="standard" name="Description" label="Description"
                className="flex justify-center w-[70%]" value={Description}
                onChange={(e) => {
                    setDescription(e.target.value );
                }}
                />
                </div>
            </div>
                </div>
            </div>
      <button
        className="font-serif
        block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm"
        onClick={makeReview}
      >
        Review this Restaurant
      </button>
    </main>
  );

}