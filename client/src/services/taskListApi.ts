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
