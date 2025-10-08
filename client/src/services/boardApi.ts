import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Board } from "../utils/types";
import axios from "axios";

export const getAllBoard = createAsyncThunk(
  "user/getAllBoard",
  async (currentUserId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/users/${currentUserId}?_embed=boards`
      );
      return res.data.boards;
    } catch (error) {
      console.log(error);
    }
  }
);
export const postBoard = createAsyncThunk(
  "user/postBoard",
  async (newBoard: Board) => {
    try {
      const res = await axios.post<Board>(
        `http://localhost:8080/boards`,
        newBoard
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const editBoard = createAsyncThunk(
  "user/editBoard",
  async (newBoard: Board) => {
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
