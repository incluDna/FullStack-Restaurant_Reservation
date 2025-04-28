"use client"

import { useEffect, useState } from "react";
import getQueueByRestaurant from "@/libs/Queue/getQueueByRestaurant";
import callQueue from "@/libs/Queue/callQueue";
import tickQueue from "@/libs/Queue/tickQueue";
import deleteQueue from "@/libs/Queue/deleteQueue";
import { Queue } from "../../interfaces";
import { useNotice } from "./NoticeContext";
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
    const {showNotice} = useNotice();
    
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
    
    const handleCall = async (queueId: string) => {
        setLoading(true);
        try {
            await callQueue(token, queueId);
        } catch (error) {
            console.log("Call error: ", error);
            showNotice("Cannot call the selected queue at this moment. Please try again.");
        }
        setPleaseReload(!pleaseReload);
    };

    const handleTick = async (queueId: string) => {
        setLoading(true);
        try {
            await tickQueue(token, queueId);
        } catch (error) {
            console.log("Tick error: ", error);
            showNotice("Cannot confirm the selected queue at this moment. Please try again.");
        }
        setPleaseReload(!pleaseReload);
    };

    const handleDelete = async (queueId: string) => {
        setLoading(true);
        try {
            await deleteQueue(token, queueId);
        } catch (error) {
            console.log("Delete error: ", error);
            showNotice("Cannot cancel the selected queue at this moment. Please try again.");
        }
        setPleaseReload(!pleaseReload);
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="w-1/2 min-h-full bg-gray-100 p-5 flex flex-col gap-y-5 items-center">
            <div className="w-full h-fit text-center break-words text-xl font-bold">
                Queue
            </div>
            <div className="w-full h-fit text-left break-words text-xl font-bold">
                Remaining : {(waitingQueues?.length!+callingQueues?.length!) || 0}
            </div>
            <div className="w-full h-fit text-left break-words text-xl font-bold">
                calling..
            </div>
            {
                callingQueues?.map((queue, index) =>
                (
                    <QueueManageCard queue={queue} key={index} handleCall={handleCall} handleDelete={handleDelete} handleTick={handleTick} />
                )
                )
            }
            <div className="w-full h-3/2 text-left break-words text-xl font-bold">
                waiting..
            </div>
            {
                waitingQueues?.map((queue, index) =>
                (
                    <QueueManageCard queue={queue} key={index} handleCall={handleCall} handleDelete={handleDelete} handleTick={handleTick} />
                )
                )
            }
        </div>
    );
}

