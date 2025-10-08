import { createSlice } from "@reduxjs/toolkit";
import type { Board } from "../../utils/types";
import { editBoard, getAllBoard, postBoard } from "../../services/authApi";

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
    clearCurrentBoard: (state) => {
      state.currentBoard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.boards = action.payload;
      })
      .addCase(getAllBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.boards.push(action.payload as Board);
      })
      .addCase(editBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedBoard = action.payload;
        if (!updatedBoard) return;

        const board = state.boards.find((b) => b.id === updatedBoard.id);
        if (board) {
          Object.assign(board, updatedBoard);
        }
      });
  },
});

export const { setCurrentBoard, clearCurrentBoard } = boardSlice.actions;
export default boardSlice.reducer;
