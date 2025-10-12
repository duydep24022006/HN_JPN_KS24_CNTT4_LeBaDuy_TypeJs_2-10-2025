import { createSlice } from "@reduxjs/toolkit";
import {
  deleteList,
  deleteTask,
  edit_Board,
  editList,
  editTask,
  getAllTask,
  getBoardWithAllData,
  postList,
  postTask,
} from "../../services/taskListApi";
import type { Board, List, Task } from "../../utils/types";

interface BoardState {
  board: Board | null;
  task: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  board: null,
  task: null,
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
      .addCase(getBoardWithAllData.fulfilled, (state: any, action) => {
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
      .addCase(deleteList.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.loading = false;
        if (state.board && state.board.lists) {
          state.board.lists = state.board.lists.filter(
            (item) => item.id !== action.payload?.id
          );
        }
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể xóa list";
      })
      .addCase(editList.fulfilled, (state, action) => {
        state.loading = false;
        const updatedList = action.payload as List;

        if (state.board?.lists) {
          state.board.lists = state.board.lists.map((list) =>
            list.id === updatedList.id ? { ...list, ...updatedList } : list
          );
        }
      })

      .addCase(editList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tạo sửa star mới";
      })
      .addCase(postTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload as Task;
        if (state.board?.lists) {
          const list = state.board.lists.find((l) => l.id === newTask.listId);
          if (list?.tasks) {
            list.tasks.push(newTask);
          }
        }
      })
      .addCase(getAllTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTask.fulfilled, (state: any, action) => {
        state.loading = false;
        state.task = action.payload as Task;
      })
      .addCase(getAllTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tải dữ liệu board";
      })
      .addCase(postTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tạo task mới";
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTask = action.payload as Task;
        if (state.board?.lists) {
          const list = state.board.lists.find(
            (l) => l.id === deletedTask.listId
          );
          if (list?.tasks) {
            list.tasks = list.tasks.filter(
              (task) => task.id !== deletedTask.id
            );
          }
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể xóa task";
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload as Task;
        if (state.board?.lists) {
          state.board.lists = state.board.lists.map((list) => {
            if (list.tasks) {
              list.tasks = list.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              );
            }
            return list;
          });
        }
      })
      .addCase(edit_Board.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBoard = action.payload as Board;

        if (state.board && state.board.id === updatedBoard.id) {
          state.board.is_starred = updatedBoard.is_starred;
        }
      })
      .addCase(edit_Board.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể cập nhật star";
      });
  },
});

export default boardSlice.reducer;
