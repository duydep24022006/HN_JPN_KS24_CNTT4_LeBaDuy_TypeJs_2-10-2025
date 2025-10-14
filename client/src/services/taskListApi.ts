import axios from "axios";
import type { Board, List, Task } from "../utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getBoardWithAllData = createAsyncThunk<
  { id: number; title: string; lists: List[] },
  number
>("board/getBoardWithAllData", async (boardId) => {
  try {
    const boardRes = await axios.get(
      `http://localhost:8080/boards/${boardId}?_embed=lists`
    );
    const board = boardRes.data;
    const lists = board.lists || [];

    const listsWithTasks = await Promise.all(
      lists.map(async (list: List) => {
        const taskRes = await axios.get(
          `http://localhost:8080/lists/${list.id}?_embed=tasks`
        );

        const tasks = taskRes.data.tasks || [];

        const tasksWithTags = await Promise.all(
          tasks.map(async (task: Task) => {
            const tagRes = await axios.get(
              `http://localhost:8080/tasks/${task.id}?_embed=tags`
            );
            return {
              ...task,
              tags: tagRes.data.tags || [],
            };
          })
        );

        return {
          ...list,
          tasks: tasksWithTags,
        };
      })
    );

    return {
      ...board,
      lists: listsWithTasks,
    };
  } catch (error) {
    console.error("Error fetching board data:", error);
    throw error;
  }
});

export const postList = createAsyncThunk(
  "tast/postList",
  async (newList: List) => {
    try {
      const res = await axios.post<List>(
        `http://localhost:8080/lists`,
        newList
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const deleteList = createAsyncThunk(
  "tast/deleteList",
  async (idList: number) => {
    try {
      const res = await axios.delete<List>(
        `http://localhost:8080/lists/${idList}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editList = createAsyncThunk(
  "tast/editList",
  async (editList: any) => {
    try {
      const res = await axios.patch<List>(
        `http://localhost:8080/lists/${editList.id}`,
        editList
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getTask = createAsyncThunk(
  "tast/getTask",
  async (taskId: number): Promise<Task> => {
    try {
      const res = await axios.get<Task>(
        `http://localhost:8080/tasks/${taskId}`
      );
      return res.data;
    } catch (error) {
      throw new Error("Không thể lấy dữ liệu task");
    }
  }
);
export const getAllTask = createAsyncThunk("task/getAllTask", async () => {
  try {
    const res = await axios.get<Task[]>("http://localhost:8080/tasks");

    const tasksWithTags = res.data.map((task) => ({
      ...task,
      tags: task.tags || [],
    }));

    return tasksWithTags;
  } catch (error) {
    console.error("Không thể lấy toàn bộ task:", error);
    throw error;
  }
});
export const postTask = createAsyncThunk(
  "tast/postTask",
  async (newTast: Task) => {
    try {
      const res = await axios.post<Task>(
        `http://localhost:8080/tasks`,
        newTast
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tast/deleteTask",
  async (id: number) => {
    try {
      const res = await axios.delete<Task>(`http://localhost:8080/tasks/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editTask = createAsyncThunk(
  "tast/editTask",
  async (editTask: any) => {
    try {
      const res = await axios.patch<Task>(
        `http://localhost:8080/tasks/${editTask.id}`,
        editTask
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const edit_Board = createAsyncThunk(
  "board/edit_Board",
  async (newBoard: any) => {
    try {
      const res = await axios.patch<Board>(
        `http://localhost:8080/boards/${newBoard.id}`,
        newBoard
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
