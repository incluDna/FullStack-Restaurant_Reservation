import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationState {
    notiStatus: number;
    queueNumber: number;
    queueStatus: string;
    queueId: string;
}

const initialState: NotificationState = {
    notiStatus: 0,
    queueNumber: -1,
    queueStatus: "waiting",
    queueId: "",
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
        updateQueueId(state, action: PayloadAction<{id: string}>) {
          const { id } = action.payload;
          state.queueId = id;
        }
    }
});

const updateNotiStatus = (state:any) => {

  let num = state.queueNumber;
  let sta = state.queueStatus;

  // Not show
  if ((num > 2 || num < 0) && sta !== "calling") {
    state.notiStatus = 0;
  } 
  
  // Yellow State
  else if (num <= 2 && sta === "waiting") {
    state.notiStatus = 1;
  } 
  
  // Red State
  else if (sta === "calling") {
    state.notiStatus = 2;
  }

}

export const { updateNotification, updateQueueId } = notificationSlice.actions;
export default notificationSlice.reducer