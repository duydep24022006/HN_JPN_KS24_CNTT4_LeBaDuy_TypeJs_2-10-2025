import { createSlice } from "@reduxjs/toolkit";
import {
  getBoardWithAllData,
  postList,
  postTask,
} from "../../services/taskListApi";
import type { Board, List, Task } from "../../utils/types";

interface BoardState {
  board: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  board: null,
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBoardWithAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBoardWithAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload;
      })
      .addCase(getBoardWithAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tải dữ liệu board";
      })

      .addCase(postList.fulfilled, (state, action) => {
        state.loading = false;
        const newList = action.payload as List;
        if (state.board?.lists) {
          state.board.lists.push(newList);
        } else if (state.board) {
          state.board.lists = [newList];
        }
      })

      .addCase(postTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload as Task;
        if (state.board?.lists) {
          const list = state.board.lists.find((l) => l.id === newTask.listId);
          if (list) {
            list.tasks.push(newTask);
          }
        }
      })
      .addCase(postTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tạo task mới";
      });
  },
});

export default boardSlice.reducer;
