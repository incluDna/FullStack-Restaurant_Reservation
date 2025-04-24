"use client"

import { useEffect, useState } from "react";
import { Queue } from "../../interfaces";
// import getQueuesByRestaurant from "@/libs/Reservation/getQueuesByRestaurant";
import QueueManageCard from "./card/managementComp/QueueManageCard";

export default function QueueManageSection({ token, restaurantID }: { token?: string, restaurantID?: string }) {
    const [queues, setQueues] = useState<Queue[] | undefined>(
        undefined,
    );
    const [callingQueues, setCallingQueues] = useState<Queue[] | undefined>(
        undefined,
    );
    const [waitingQueues, setWaitingQueues] = useState<Queue[] | undefined>(
        undefined,
    );
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // force to fetch
    const [pleaseReload, setPleaseReload] = useState<boolean>(false);
    // this was used to force reload component when queue card appearance should be changed/updated

    if (restaurantID == null) return (
        <div className="w-1/2 h-full text-center break-words text-xl font-bold">
            Invalid Restaurant ID
        </div>
    );
    if (token == null) return (
        <div className="w-1/2 h-full text-center break-words text-xl font-bold">
            Please log in first
        </div>
    );


    useEffect(() => {
        const fetchQueues = async () => {
            try {
                // IMPLEMENT AFTER HAVE LIBS
                const response: any = await getQueueByRestaurant(restaurantID, token);
                setQueues(response.data);

            } catch (error) {
                console.error("Error fetching queues:", error);
                setError("Error fetching queues.");
                setLoading(false);
            }
        };

        fetchQueues();
    }, [pleaseReload]);

    // need separate fetch and filter useEffect cuz it's procederal otherwise it's buggy
    useEffect(() => {
        const filteredQueues = async () => {
            try {
                // filtering
                const waitingQueuesFiltered = queues?.filter((item) => item.queueStatus === 'waiting') || [];
                const callingQueuesFiltered = queues?.filter((item) => item.queueStatus === 'calling') || [];
                
                setWaitingQueues(waitingQueuesFiltered);
                setCallingQueues(callingQueuesFiltered);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching queues:", error);
                setError("Error fetching queues.");
                setLoading(false);
            }
        };

        filteredQueues();
    }, [queues]);
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="w-1/2 min-h-full bg-blue-100 p-5 flex flex-col gap-y-5 items-center">
            <div className="w-full h-fit text-center break-words text-xl font-bold">
                Queue
            </div>
            <div className="w-full h-fit text-left break-words text-xl font-bold">
                Remaing : {queues?.length || 0}
            </div>
            <div className="w-full h-fit text-left break-words text-xl font-bold">
                calling..
            </div>
            {
                callingQueues?.map((queue, index) =>
                (
                    <QueueManageCard queue={queue} key={index}/>
                )
                )
            }
            <div className="w-full h-3/2 text-left break-words text-xl font-bold">
                waiting..
            </div>
            {
                waitingQueues?.map((queue, index) =>
                (
                    <QueueManageCard queue={queue} key={index}/>
                )
                )
            }
        </div>
    );
}

