import { Action, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { Hangar, Palette, Parcel, Rack } from "@/types";
import { fetchInHangarArrivals } from "./arrival";

export interface StorageState {
  racksLoading: "idle" | "pending" | "succeeded" | "failed";
  racks: { [key: string]: Rack };

  hangarsLoading: "idle" | "pending" | "succeeded" | "failed";
  hangars: { [key: string]: Hangar };

  parcelsLoading: "idle" | "pending" | "succeeded" | "failed";
  parcels: Array<Parcel>;

  palettesLoading: "idle" | "pending" | "succeeded" | "failed";
  palettes: Array<Palette>;
}

const initialState: StorageState = {
  racksLoading: "idle",
  racks: {},

  hangarsLoading: "idle",
  hangars: {},

  parcelsLoading: "idle",
  parcels: [],

  palettesLoading: "idle",
  palettes: [],
};

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

const baseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/api`;

export const fetchHangars = createAsyncThunk(
  "storage/fetchHangars",
  async (): Promise<Hangar[]> => {
    const response = await fetch(baseUrl + `/storage/hangar/all`);

    return (await response.json()) as Hangar[];
  }
);

export const fetchRacks = createAsyncThunk(
  "storage/fetchRacks",
  async (): Promise<Rack[]> => {
    const response = await fetch(baseUrl + `/storage/rack/all`);

    return (await response.json()) as Rack[];
  }
);

export const fetchParcels = createAsyncThunk(
  "storage/fetchParcels",
  async (): Promise<Parcel[]> => {
    const response = await fetch(baseUrl + `/storage/palette/all`);

    return (await response.json()) as Parcel[];
  }
);

export const fetchPalettes = createAsyncThunk(
  "storage/fetchPalettes",
  async (): Promise<Palette[]> => {
    const response = await fetch(
      `http://localhost:8000/api/storage/palette/all`
    );

    return (await response.json()) as Palette[];
  }
);

export const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    setStorageState(state, action) {
      state.parcels = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: ActionWithPayload<AppState>) => {
      return {
        ...state,
        ...action.payload.storage,
      };
    });

    builder.addCase(fetchHangars.pending, (state, action) => {
      state.hangarsLoading = "pending";
    });
    builder.addCase(fetchHangars.fulfilled, (state, action) => {
      state.hangarsLoading = "succeeded";

      let hangars = {};
      action.payload.forEach((hangar) => {
        hangars = { ...hangars, [hangar.id]: hangar };
      });

      state.hangars = hangars;
    });
    builder.addCase(fetchHangars.rejected, (state, action) => {
      state.hangarsLoading = "failed";
    });

    builder.addCase(fetchRacks.pending, (state, action) => {
      state.racksLoading = "pending";
    });
    builder.addCase(fetchRacks.fulfilled, (state, action) => {
      state.racksLoading = "succeeded";

      let racks = {};
      action.payload.forEach((rack) => {
        racks = { ...racks, [rack.id]: rack };
      });

      state.racks = racks;
    });
    builder.addCase(fetchRacks.rejected, (state, action) => {
      state.racksLoading = "failed";
    });

    builder.addCase(fetchParcels.pending, (state, action) => {
      state.parcelsLoading = "pending";
    });
    builder.addCase(fetchParcels.fulfilled, (state, action) => {
      state.parcels = action.payload;
      state.parcelsLoading = "succeeded";
    });
    builder.addCase(fetchParcels.rejected, (state, action) => {
      state.parcelsLoading = "failed";
    });

    builder.addCase(fetchPalettes.pending, (state, action) => {
      state.palettesLoading = "pending";
    });
    builder.addCase(fetchPalettes.fulfilled, (state, action) => {
      state.palettes = action.payload;
      state.palettesLoading = "succeeded";
    });
    builder.addCase(fetchPalettes.rejected, (state, action) => {
      state.palettesLoading = "failed";
    });
  },
});

export const { setStorageState } = storageSlice.actions;

export const selectParcels = (state: AppState) => state.storage.parcels;
export const selectPalettes = (state: AppState) => state.storage.palettes;

export default storageSlice.reducer;
