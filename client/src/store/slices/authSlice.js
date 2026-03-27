import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success(res.data.message);
      // toast.success("Registration Successfuly.");
      thunkAPI.dispatch(toggleAuthPopup());
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    toast.success(res.data.message);
    // toast.success("Logged Successfuly.");
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getUser = createAsyncThunk(
  "auth/register",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me", data);
      thunkAPI.dispatch(toggleAuthPopup());
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to get user",
      );
    }
  },
);

export const logout = createAsyncThunk("auth/register", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/logout", data);
    toast.success(res.data.message);
    // toast.success("Registration Successfuly.");
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(
      error.response.data.message || "Failed to logout",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {},
});

export default authSlice.reducer;
