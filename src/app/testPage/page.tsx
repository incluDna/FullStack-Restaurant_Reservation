'use client'
import getQueueByRestaurant from "@/libs/Queue/getQueueByRestaurant";
import { getAuthCookie } from "@/libs/User/getAuthCookie";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [restaurantQueue, setRestaurantQueue] = useState<any>(null);
  const restaurantId = '67f2b3e3feb1b747b5a13fce';

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = await getAuthCookie();
        if (data.success) {
          setToken(data.token);
        } else {
          console.error("Auth error:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch auth cookie", err);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchQueue = async () => {
      if (token) {
        try {
          const queue = await getQueueByRestaurant(restaurantId, token);
          setRestaurantQueue(queue);
        } catch (err) {
          console.error("Failed to fetch queue", err);
        }
      }
    };
    fetchQueue();
  }, [token]);

  if (!token || !restaurantQueue) return <div>loading...</div>;

  return (
    <div>
      {restaurantQueue.data.map((queue: {
        _id: string,
        user: { _id: string, name: string },
        restaurant: string,
        seatCount: string,
        queueStatus: string,
        createdAt: string
      }) => (
        <div key={queue._id}>
          <div>id: {queue._id}</div>
          <div>userID: {queue.user._id}</div>
          <div>userName: {queue.user.name}</div>
          <div>restaurant: {queue.restaurant}</div>
          <div>seatCount: {queue.seatCount}</div>
          <div>queueStatus: {queue.queueStatus}</div>
          <div>createdAt: {queue.createdAt}</div>
          <div></div>
        </div>
      ))}
    </div>
  );
}
