import { createSlice } from "@reduxjs/toolkit";

const extraSlice = createSlice({
  name: "extra",
  initialState: {
    openedComponent: "Dashboard",
    isNavbarOpened: false,
    isViewProductModalOpened: false,
    isCreateProductModalOpened: false,
    isUpdateProductModalOpened: false,
  },
  reducers: {
    toggleComponent: (state, action) => {
      state.openedComponent = action.payload;
    },
    toggleNavbar: (state) => {
      state.isNavbarOpened = !state.isNavbarOpened;
    },
    toggleCreateProdcutModal: (state, action) => {
      state.isCreateProductModalOpened = !state.isCreateProductModalOpened;
    },
    toggleVewProductModal: (state) => {
      state.isViewProductModalOpened = !state.isViewProductModalOpened;
    },
    toggleUpdateProductModal: (state, action) => {
      state.isUpdateProductModalOpened = !state.isUpdateProductModalOpened;
    },
  },
});

export const {
  toggleComponent,
  toggleNavbar,
  toggleCreateProdcutModal,
  toggleVewProductModal,
  toggleUpdateProductModal,
} = extraSlice.actions;

export default extraSlice.reducer;
