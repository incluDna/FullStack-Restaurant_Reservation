'use client'
import ReviewForm from "@/components/ReviewForm";
import getUserProfile from "@/libs/User/getUserProfile";
import { useEffect, useState } from "react";
import { getAuthCookie } from "@/libs/User/getAuthCookie";
import { useParams } from "next/navigation";

export default function editReviews() {
    const [token, setToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    useEffect(() => {
        async function fetchToken() {
            try {
                const data = await getAuthCookie();
                if (data.success) {
                    setToken(data.token);
                    const userProfile = await getUserProfile(data.token);
                    setProfile(userProfile);
                } else {
                    console.error("Auth error:", data.error);
                }
            } catch (err) {
                console.error("Failed to fetch auth cookie", err);
            }
        }
        fetchToken();
    }, []);
    if (!token) return;
    if (!profile) return;

    return (

        <ReviewForm token={token} profile={profile} />

    )
}