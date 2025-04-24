import { useState, useEffect } from "react";
import NotificationCard from "./NotificationCard";

export default function NotificationSection() {
    const [notiStatus, setNotiStatus] = useState<number>(0);
    const [queueNumber, setQueueNumber] = useState<number>(0);

    // auto call API to check queue status
    useEffect(() => {

        // checking and setting 
        const checkQueueStatus = () => {

            // get queue by token

            // call API, using queueId and restaurantId from queue
            const response = { num: 2, sta: "waiting" };
            setQueueNumber(response.num);

            // not show (state 0) => can't find queue or (num>3 && sta != "calling")
            if ((response.num > 3 && response.sta != "calling")) {
                setNotiStatus(0);
            }

            // show state 1 => num<=3 && sta == "waiting"
            else if (response.num <= 3 && response.sta == "waiting") {
                setNotiStatus(1);
            }

            // show state 2 => sta == "calling"
            else if (response.sta == "calling") {
                setNotiStatus(2);
            }

        };

        // execute function
        checkQueueStatus();

        // set up interval
        const interval = setInterval(() => {
            checkQueueStatus();
        }, 60 * 1000);

        // clear interval
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="w-full h-fit justify-center">
            {
                notiStatus >= 1 ? <NotificationCard sta={notiStatus} queue={queueNumber}/> : <></>
            }
        </div>
    );

}