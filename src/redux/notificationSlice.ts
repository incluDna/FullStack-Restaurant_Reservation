import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationState {
    notiStatus: number;
    queueNumber: number;
}

const initialState: NotificationState = {
    notiStatus: 0,
    queueNumber: 0,
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        updateNotification(state, action: PayloadAction<{num: number, sta: string}>) {
            const { num, sta } = action.payload;

            // Update queueNumber
            state.queueNumber = num;
      
            // Not show
            if (num > 3 && sta !== "calling") {
              state.notiStatus = 0;
            } 
            
            // Yellow State
            else if (num <= 3 && sta === "waiting") {
              state.notiStatus = 1;
            } 
            
            // Red State
            else if (sta === "calling") {
              state.notiStatus = 2;
            }
        }
    }
});

export const { updateNotification } = notificationSlice.actions;
export default notificationSlice.reducer