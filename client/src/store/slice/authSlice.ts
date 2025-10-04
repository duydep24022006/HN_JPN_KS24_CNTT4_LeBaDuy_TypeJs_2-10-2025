import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../utils/types";
import { getUser } from "../../services/authApi";
interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUser = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.currentUser = action.payload;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
