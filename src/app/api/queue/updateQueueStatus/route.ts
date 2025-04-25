import { updateNotification } from "@/redux/notificationSlice";
import { store } from "../../../../redux/store"
import { NextApiRequest, NextApiResponse } from "next";

const checkQueueStatus = () => {
    try {
        // get queue by token
        

        // call API, using queueId and restaurantId from queue
        const response = { num: 2, sta: "waiting" };
        
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