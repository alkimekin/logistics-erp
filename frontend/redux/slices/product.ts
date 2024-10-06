import { Action, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

import { BaseProduct, Palette, Parcel, Product } from "@/types";
import build from "next/dist/build";

export interface ProductState {
  baseProducts: Array<BaseProduct>;
  products: Array<Product>;
  baseProductsLoading: "idle" | "pending" | "succeeded" | "failed";
  productsLoading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: ProductState = {
  baseProducts: [],
  products: [],
  baseProductsLoading: "idle",
  productsLoading: "idle",
};

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

const baseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/api`;

export const fetchBaseProducts = createAsyncThunk(
  "product/fetchBaseProducts",
  async () => {
    const response = await fetch(baseUrl + `/product/base`);
    return (await response.json()) as BaseProduct[];
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const response = await fetch(baseUrl + "/product/all");
    return (await response.json()) as Product[];
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductState(state, action) {
      state.baseProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: ActionWithPayload<AppState>) => {
      return {
        ...state,
        ...action.payload.product,
      };
    });

    builder.addCase(fetchBaseProducts.pending, (state, action) => {
      state.baseProductsLoading = "pending";
    });
    builder.addCase(fetchBaseProducts.fulfilled, (state, action) => {
      state.baseProducts = action.payload;
      state.baseProductsLoading = "succeeded";
    });
    builder.addCase(fetchBaseProducts.rejected, (state, action) => {
      state.baseProductsLoading = "failed";
    });

    builder.addCase(fetchProducts.pending, (state, action) => {
      state.productsLoading = "pending";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.productsLoading = "succeeded";
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.productsLoading = "failed";
    });
  },
});

export const { setProductState } = productSlice.actions;

export const selectBaseProducts = (state: AppState) =>
  state.product.baseProducts;

export const selectProducts = (state: AppState) => state.product.products;

export default productSlice.reducer;
