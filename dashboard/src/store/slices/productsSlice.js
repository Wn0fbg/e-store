import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import {
  toggleCreateProdcutModal,
  toggleUpdateProductModal,
} from "./extraSlice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    totalProducts: 0,
  },
  reducers: {
    createProductRequest(state) {
      state.loading = true;
    },
    createProductSuccess(state, action) {
      state.loading = false;
      state.products = [action.payload, ...state.products];
    },
    createProductFalied(state) {
      state.loading = false;
    },

    getAllProductsRequest(state) {
      state.loading = true;
    },
    getAllProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload.products;
      state.totalProducts = action.payload.totalProducts;
    },
    getAllProductsFalied(state) {
      state.loading = false;
    },

    updateProductRequest(state) {
      state.loading = true;
    },
    updateProductSuccess(state, action) {
      state.loading = false;
      state.products = action.products.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    },
    updateProductFalied(state) {
      state.loading = false;
    },

    deleteProductRequest(state) {
      state.loading = true;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
      state.totalProducts = Math.max(0, state.totalProducts - 1);
    },
    deleteProductFalied(state) {
      state.loading = false;
    },
  },
});

export const createNewProduct = (data) => async (dispatch) => {
  dispatch(productSlice.actions.createProductRequest());
  await axiosInstance
    .post("/product/admin/create", data)
    .then((res) => {
      dispatch(productSlice.actions.createProductSuccess(res.data.product));
      toast.success(res.data.message || "Product created successfuly.");
      dispatch(toggleCreateProdcutModal());
    })
    .catch((error) => {
      dispatch(productSlice.actions.createProductFalied());
      toast.error(error.response?.data?.message || "Failed to create product.");
    });
};

export const fetchAllProducts = (page) => async (dispatch) => {
  dispatch(productSlice.actions.getAllProductsRequest());
  await axiosInstance
    .get(`/product?page=${page || 1}`)
    .then((res) => {
      dispatch(productSlice.actions.getAllProductsSuccess(res.data));
    })
    .catch((error) => {
      dispatch(productSlice.actions.getAllProductsFalied());
    });
};

export const updateProduct = (data, id) => async (dispatch) => {
  dispatch(productSlice.actions.updateProductRequest());
  await axiosInstance
    .put(`/product/admin/update/${id}`, data)
    .then((res) => {
      dispatch(
        productSlice.actions.updateProductSuccess(res.data.updatedProduct),
      );
      toast.success(res.data.message || "Product updated successfuly");
      dispatch(toggleUpdateProductModal());
    })
    .catch((error) => {
      dispatch(productSlice.actions.updateProductFalied());
      toast.error(error.response?.data?.message || "Failed to update product.");
    });
};

export const deleteProduct = (id, page) => async (dispatch) => {
  dispatch(productSlice.actions.deleteProductRequest());
  await axiosInstance
    .delete(`/product/admin/delete/${id}`)
    .then((res) => {
      dispatch(productSlice.actions.deleteProductSuccess(id));
      toast.success(res.data.message || "Product deleted successfuly");

      const state = getState();
      const updatedTotal = state.product.totalProducts;
      const updatedMaxPage = Math.ceil(updatedTotal / 10) || 1;

      const validPage = Math.min(page, updatedMaxPage);
      dispatch(fetchAllProducts(validPage));
    })
    .catch((error) => {
      dispatch(productSlice.actions.deleteProductFalied());
      toast.error(error.response?.data?.message || "Failed to delete product");
    });
};

export default productSlice.reducer;
