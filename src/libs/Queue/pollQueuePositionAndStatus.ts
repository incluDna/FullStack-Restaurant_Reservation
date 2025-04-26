import { store } from "@/redux/store";
import { updateNotification } from "@/redux/notificationSlice";

// main function to update queue position and status
export default function pollQueuePositionAndStatus(token: string) {
     
    if (!token) return;  
    let cancelled = false;

    // 1
    async function pollQueueLoop() {           
        while (!cancelled) {
            
            const ctrl = new AbortController();
            try {
                // getIncompleteQueue(token): promise<queue> 
                const queue = await pollIncompleteQueue(token, ctrl.signal);

                if (queue.success) {
                    if ('response' in queue && queue.response.count > 0) {
                        // move to pollStateLoop until cannot find token or queueId
                        await pollQueueStateLoop(token, queue.response.data[0]._id)

                    } else {
                        // retry before polling again
                        await new Promise(r => setTimeout(r, 4000));
                    }
                }
            } catch (error) {
                console.error("Error in pollIncompleteQueueLoop:", error, "Raedy for retry...");
                await new Promise(r => setTimeout(r, 4000));
            }            
        }    
    }  

    // 3
    async function pollQueueStateLoop(token: string, queueID: string) {
        const ctrl = new AbortController();

        try {
            while (!cancelled) {               
                const queueStatus = await pollQueueState(token, queueID, ctrl.signal);

                if (!queueStatus.success) {
                    break;
                } else if (queueStatus.timeout) {
                    continue;
                } else {
                    store.dispatch(updateNotification({num: queueStatus.position, sta: queueStatus.status}));
                }              
            }

        } catch (error) {
            console.error("Error in pollQueueStateLoop:", error, "Back to fetch incomplete queue...");
        } finally {
            ctrl.abort();
        }

    }

    // 4
    async function pollQueueState(token: string, queueID: string, signal: AbortSignal) {
        console.log("############ Noti Test1 ##")
        return await fetch(`${process.env.BACKEND_URL}/api/queues/${queueID}/long-poll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            signal: signal,
        })
        .then((response) => {
            
            if (response.status === 204) {
                return { success: true, timeout: true };
            }
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error("Error fetching queue state:", error); 
            return { success: false, error };
        });
    }

    // 2
    async function pollIncompleteQueue(token: string, signal: AbortSignal) {
        return await fetch(`${process.env.BACKEND_URL}/api/queues/incomplete/long-poll`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
            },
            signal: signal,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Response was not ok");
            } else if (response.status === 204) {
                console.log("Timeout, Please try again");
                return { success: false, aborted: true };
            }
            return response.json();
        })
        .then((data) => {
            return { success: true, response: data};
        })
        .catch((error) => {
            if (error.name === "AbortError") {
                // Handle abort case
                return { success: false, aborted: true };
            }
            // console.error("Error fetching incomplete queue:", error);
            return { success: false, error };
        });
    }

    // Start polling
    pollQueueLoop();

    // Cleanup function
    return () => {
        cancelled = true;
    }

}




