import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import boardSlice from "./slice/boardSlice";
import listSlice from "./slice/listSlice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    boardSlice: boardSlice,
    listSlice: listSlice,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
