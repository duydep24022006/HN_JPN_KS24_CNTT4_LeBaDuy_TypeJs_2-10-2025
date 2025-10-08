import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import boardSlice from "./slice/boardSlice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    boardSlice: boardSlice,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
