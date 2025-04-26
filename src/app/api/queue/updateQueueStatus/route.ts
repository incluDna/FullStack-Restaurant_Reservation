import { updateNotification } from "@/redux/notificationSlice";
import { store } from "../../../../redux/store"
import { NextApiRequest, NextApiResponse } from "next";
import getQueuePosition from "@/libs/Queue/getQueuePosition";
import { getAuthCookie } from "@/libs/User/getAuthCookie";

const checkQueueStatus = async () => {
    try {
        // get token
        const { success, token: newToken, role, error, profile } = await getAuthCookie();
        if (!success) throw new Error(error || "Auth failed");

        // get queue by token
        const queueResponse = await 

        // call API, using queueId and restaurantId from queue
        const response = await getQueuePosition(newToken, );
        
        return response;
    } catch (error) {
        throw new Error("Error at checkQueueStatus: " + error);
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            let queueStatus = checkQueueStatus();
            store.dispatch(updateNotification(queueStatus));
    
            res.status(200).json({ message: "Queue Status updated", queueStatus })
        } else {
            res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}