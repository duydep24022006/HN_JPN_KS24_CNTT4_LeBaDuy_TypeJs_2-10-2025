import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../utils/types";
import { getUser, postUser } from "../../services/authApi";

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
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
        localStorage.setItem(
          "currentUserId",
          JSON.stringify(action.payload.id)
        );
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error = action.payload as string;
      })
      .addCase(postUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.users.push(action.payload);
        state.currentUser = null;
      })
      .addCase(postUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.currentUser = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
