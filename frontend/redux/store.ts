import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { productSlice } from "./slices/product";
import { createWrapper } from "next-redux-wrapper";
import { arrivalSlice } from "./slices/arrival";
import { storageSlice } from "./slices/storage";
import { orderSlice } from "./slices/order";
import { authSlice } from "./slices/auth";

export const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [productSlice.name]: productSlice.reducer,
      [arrivalSlice.name]: arrivalSlice.reducer,
      [storageSlice.name]: storageSlice.reducer,
      [orderSlice.name]: orderSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
