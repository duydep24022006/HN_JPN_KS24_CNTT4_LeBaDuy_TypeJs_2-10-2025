import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../utils/types";

export const getUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("user/getUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await axios.get<User[]>(
      `http://localhost:8080/users?email=${email}&password=${password}`
    );
    if (res.data.length > 0) {
      return res.data[0];
    } else {
      return rejectWithValue("");
    }
  } catch (error) {
    return rejectWithValue("Lỗi server" + error);
  }
});
export const postUser = createAsyncThunk<User, User, { rejectValue: string }>(
  "user/postUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const validetaEmail = await axios.get<User[]>(
        `http://localhost:8080/users?email=${newUser.email}`
      );
      if (validetaEmail.data.length > 0) {
        return rejectWithValue("Email đã tồn tại");
      } else {
        const res = await axios.post<User>(
          "http://localhost:8080/users",
          newUser
        );
        return res.data;
      }
    } catch (error) {
      return rejectWithValue("Lỗi server" + error);
    }
  }
);
