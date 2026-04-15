import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchMyOrders = createAsyncThunk(
  "order/orders/me",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/order/orders/me");
      return res.data.myOrders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const placeOrder = createAsyncThunk(
  "order/new",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/order/new", data);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      toast.error(
        error.response.data.message || "Failedt to place order, try again.",
      );
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
  },
  reducers: {
    toggleOrderStep(state) {
      state.orderStep = 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyOrders.pending, (state) => {});
  },
});

export default orderSlice.reducer;
export const {} = orderSlice.actions;
