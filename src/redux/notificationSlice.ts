import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationState {
    notiStatus: number;
    queueNumber: number;
    queueStatus: string;
}

const initialState: NotificationState = {
    notiStatus: 0,
    queueNumber: 0,
    queueStatus: "waiting",
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        updateNotification(state, action: PayloadAction<{num: number, sta: string}>) {
          const { num, sta } = action.payload;
          state.queueNumber = num;
          state.queueStatus = sta;
          updateNotiStatus(state);
        },
    }
});

const updateNotiStatus = (state:any) => {

  let num = state.queueNumber;
  let sta = state.queueStatus;

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

export const { updateNotification } = notificationSlice.actions;
export default notificationSlice.reducer