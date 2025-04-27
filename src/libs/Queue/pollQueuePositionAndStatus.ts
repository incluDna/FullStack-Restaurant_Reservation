import { store } from "@/redux/store";
import { RootState } from "@/redux/store";
import { updateNotification } from "@/redux/notificationSlice";

// main function to update queue position and status
export default function pollQueuePositionAndStatus(token: string) {
     
    if (!token) return;  
    let cancelled = false;
    const initialState = (store.getState() as RootState);
    const refreshRedux = () => {
        store.dispatch(updateNotification({num: -1, sta: "waiting"}));
    }

    let lastPosition = initialState.queueNumber || -1;
    let queueVersion:number = -1; 
    let stateVersion:number = -1;

    // 1
    async function pollQueueLoop() {           
        while (!cancelled) {
            
            const ctrl = new AbortController();
            try {
                // getIncompleteQueue(token): promise<queue> 
                const queue = await pollIncompleteQueue(token, ctrl.signal);
                
                    if (queue.success && 'response' in queue) {
                        if (queue.response.timeout) {
                            continue;
                        } else { 
                            if (queue.response.count > 0) {
                                queueVersion = queue.response.version;

                                // move to pollStateLoop until cannot find token or queueId
                                await pollQueueStateLoop(token, queue.response.data[0]._id)
                            } else {
                                queueVersion = queue.response.version;
                                refreshRedux();
                                throw new Error("This user doesn't have queue");
                            }
                        } 
                        
                    } else {
                        // retry before polling again
                        throw new Error("response not success");
                    }
            } catch (error) {
                console.log("Error in pollIncompleteQueueLoop:", error, "Raedy for retry...");
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
                    console.log("queueStatus.success is false");
                    refreshRedux();
                    break;
                } else if ('response' in queueStatus) {
                        // handle timeout
                        if (queueStatus.response.timeout) {
                            continue;
                        } else {

                        // dispatch to redux store
                        store.dispatch(updateNotification({num: queueStatus.response.position, sta: queueStatus.response.status}));

                        // update version and position
                        stateVersion = queueStatus.response.version
                        lastPosition = queueStatus.response.position;
                    }//         const token = getAuthCookie();
                } else {
                    throw new Error("No response from server");
                }              
            }

        } catch (error) {
            refreshRedux();
            console.error("Error in pollQueueStateLoop:", error, "Back to fetch incomplete queue...");
        } finally {
            refreshRedux();
            ctrl.abort();
        }

    }  

    // 4
    async function pollQueueState(token: string, queueID: string, signal: AbortSignal) {
        
        return await fetch(`${process.env.BACKEND_URL}/api/queues/${queueID}/long-poll?since=${stateVersion}&lastPosition=${lastPosition}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            signal: signal,
        })
        .then((response) => {           
            if (response.status === 204) {
                console.log("Timeout at pollQueueState, Please try again");
                return { timeout: true };
            }
            else if (!response.ok) {
                return new Error("Response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            return { success: true, response: data };
        })
        .catch((error) => {
            console.error("Error fetching queue state:", error); 
            return { success: false, error };
        });
    }

    // 2
    async function pollIncompleteQueue(token: string, signal: AbortSignal) {
        return await fetch(`${process.env.BACKEND_URL}/api/queues/incomplete/long-poll?since=${queueVersion}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
            },
            signal: signal,
        })
        .then((response) => {
            if (!response.ok) {
                return new Error("Response was not ok");
            } else if (response.status === 204) {
                console.log("Timeout at pollIncompleteQueue, Please try again");
                return { timeout: true };
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




