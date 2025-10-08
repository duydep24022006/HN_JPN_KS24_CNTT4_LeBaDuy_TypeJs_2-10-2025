import axios from "axios";
import type { List, Task } from "../utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getBoardWithAllData = createAsyncThunk<
  { id: number; title: string; lists: List[] }, // return type
  number // param type
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

export const editTask = createAsyncThunk(
  "tast/editTask",
  async (newTast: Task) => {
    try {
      const res = await axios.patch<Task>(
        `http://localhost:8080/tasks/${newTast.id}`,
        newTast
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
