'use client'
import { Button } from "@mui/material";
import { updateNotification } from "@/redux/notificationSlice";
import { store } from "@/redux/store";

export default function TestButton() {
    return (
        <Button onClick={() => {
            store.dispatch(updateNotification({num: 22, sta: "waiting"}));
            console.log("Test button clicked");
        }}
        className="bg-black text-white h-32 w-32 fixed top-1/2 left-1/2 z-50"
        >
            Test
        </Button>
    )
}