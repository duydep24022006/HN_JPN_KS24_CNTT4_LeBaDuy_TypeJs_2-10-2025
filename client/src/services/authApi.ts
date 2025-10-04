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
      return rejectWithValue("Sai email hoặc mật khẩu");
    }
  } catch (error) {
    return rejectWithValue("Lỗi server" + error);
  }
});
