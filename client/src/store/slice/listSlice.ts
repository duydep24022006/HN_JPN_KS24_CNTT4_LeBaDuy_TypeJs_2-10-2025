import { createSlice } from "@reduxjs/toolkit";
import { getBoardWithAllData } from "../../services/taskListApi";
import type { List } from "../../utils/types";

interface Lists {
  id: number;
  title: string;
  lists: List[];
}

interface ListState {
  list: Lists | null;
  loading: boolean;
}

const initialState: ListState = {
  list: null,
  loading: false,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBoardWithAllData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBoardWithAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getBoardWithAllData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default boardSlice.reducer;
