import { Action, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { Arrival, Palette } from "@/types";

export interface ArrivalState {
  newArrivalState: "idle" | "pending" | "succeeded" | "failed";
  resetInHangarArrivalPaletteState: "idle" | "pending" | "succeeded" | "failed";

  inHangarArrivalsLoading: "idle" | "pending" | "succeeded" | "failed";
  inHangarArrivals: Arrival[];

  watchfileArrivalsLoading: "idle" | "pending" | "succeeded" | "failed";
  watchfileArrivals: Arrival[];

  confirmedArrivalsLoading: "idle" | "pending" | "succeeded" | "failed";
  confirmedArrivals: Arrival[];
}

const initialState: ArrivalState = {
  newArrivalState: "idle",
  resetInHangarArrivalPaletteState: "idle",

  inHangarArrivalsLoading: "idle",
  inHangarArrivals: [],

  watchfileArrivalsLoading: "idle",
  watchfileArrivals: [],

  confirmedArrivalsLoading: "idle",
  confirmedArrivals: [],
};

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

const baseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/api`;

export const createNewArrival = createAsyncThunk<
  {
    companyName: string;
    invoiceNumber: string;
    palettes: Omit<Palette, "id" | "rack" | "hangar">[];
  },
  any
>("product/createNewArrival", async (data) => {
  const response = await fetch(baseUrl + `/arrival/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status == 200) {
    alert("Kayit basari ile olusturuldu");
  } else {
    alert("Kayit olusturulamadi");
  }

  return await response.json();
});

export const fetchInHangarArrivals = createAsyncThunk(
  "arrival/fetchInHangarArrivals",
  async (): Promise<Arrival[]> => {
    const response = await fetch(baseUrl + `/arrival/inHangar`);

    return (await response.json()) as Arrival[];
  }
);

export const fetchWatchfileLoadedArrivals = createAsyncThunk(
  "arrival/fetchWatchfileLoadedArrivals",
  async (): Promise<Arrival[]> => {
    const response = await fetch(baseUrl + `/arrival/watchfile`);

    return (await response.json()) as Arrival[];
  }
);

export const fetchConfirmedArrivals = createAsyncThunk(
  "arrival/fetchConfirmedArrivals",
  async (): Promise<Arrival[]> => {
    const response = await fetch(baseUrl + `/arrival/confirmed`);

    return (await response.json()) as Arrival[];
  }
);

export const resetInHangarArrivalPalette = createAsyncThunk(
  "storage/resetInHangarArrivalPalette",
  async (
    data: any
  ): Promise<{
    palette: Palette;
    arrivalIndex: number;
    paletteIndex: number;
  }> => {
    const response = await fetch(
      baseUrl + `/storage/palette/unique?paletteId=${data.paletteId}`
    );

    const palette = (await response.json()) as Palette;

    return {
      palette,
      arrivalIndex: data.arrivalIndex,
      paletteIndex: data.paletteIndex,
    };
  }
);

interface ApiUpdateInHangarArrivalPaletteArgType {
  arrivalIndex: number;
  paletteIndex: number;
  update: {
    paletteId: string;
    hangarId: number;
    rackId: number;
  };
}

export const apiUpdateInHangarArrivalPalette = createAsyncThunk<
  // Return type of the payload creator
  {
    palette: Palette;
    arrivalIndex: number;
    paletteIndex: number;
  },
  // First argument to the payload creator
  ApiUpdateInHangarArrivalPaletteArgType,
  { dispatch: AppDispatch }
>("storage/apiUpdatePaletteHangarAndRack", async (args, thunkApi) => {
  const response = await fetch(baseUrl + `/storage/palette/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args.update),
  });

  if (response.status == 200) {
    alert("Palet basari ile kaydedildi.");
  } else {
    alert("Palet kaydedilemedi.");
  }

  const palette = (await response.json()) as Palette;

  return {
    palette,
    arrivalIndex: args.arrivalIndex,
    paletteIndex: args.paletteIndex,
  };
});

export const addWatchfileToArrival = createAsyncThunk<
  {
    arrival: Arrival;
    arrivalIndex: number;
  },
  {
    arrivalIndex: number;
    arrivalId: number;
    xmlData: string;
  },
  { dispatch: AppDispatch }
>("arrival/addWatchfileToArrival", async (args, thunkApi) => {
  thunkApi.dispatch(
    updateWatchfileArrivalWatchfileLoading({
      arrivalIndex: args.arrivalIndex,
      watchfileLoading: true,
    })
  );

  const response = await fetch(
    baseUrl + `/arrival/import_xml?arrivalId=${args.arrivalId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: args.xmlData,
    }
  );

  thunkApi.dispatch(
    updateWatchfileArrivalWatchfileLoading({
      arrivalIndex: args.arrivalIndex,
      watchfileLoading: false,
    })
  );

  if (response.status == 200) {
    alert("Xml basari ile yuklendi");
  } else {
    alert("Xml yuklenemedi");
  }

  const arrival = (await response.json()) as Arrival;

  return { arrival, arrivalIndex: args.arrivalIndex };
});

export const unblockArrival = createAsyncThunk<
  {
    arrival: Arrival;
    arrivalIndex: number;
  },
  {
    arrivalIndex: number;
    arrivalId: number;
  }
>("arrival/unblockArrival", async (args) => {
  const response = await fetch(baseUrl + `/arrival/unblock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ arrivalId: args.arrivalId }),
  });

  if (response.status == 200) {
    alert("Blokaj Kaldirildi");
  } else {
    alert("Blokaj Kaldirilamadi");
  }

  const arrival = (await response.json()) as Arrival;

  return { arrival, arrivalIndex: args.arrivalIndex };
});

export const blockArrival = createAsyncThunk<
  {
    arrival: Arrival;
    arrivalIndex: number;
  },
  {
    arrivalIndex: number;
    arrivalId: number;
  }
>("arrival/blockArrival", async (args) => {
  const response = await fetch(baseUrl + `/arrival/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ arrivalId: args.arrivalId }),
  });

  if (response.status == 200) {
    alert("Blokaj Olusturuldu");
  } else {
    alert("Blokaj Olusturulamadi");
  }

  const arrival = (await response.json()) as Arrival;

  return { arrival, arrivalIndex: args.arrivalIndex };
});

export const udpateWatchfileLoadedArrivalsLoadingState = createAsyncThunk(
  "arrival/udpateWatchfileLoadedArrivalsLoadingState",
  async (): Promise<Arrival[]> => {
    const response = await fetch(baseUrl + `/arrival/watchfile`);

    return (await response.json()) as Arrival[];
  }
);

export const arrivalSlice = createSlice({
  name: "arrival",
  initialState,
  reducers: {
    updateInHangarArrivalPaletteHangar(state, action) {
      let newInHangarArrivals = [...state.inHangarArrivals];
      newInHangarArrivals[action.payload.arrivalIndex].palettes[
        action.payload.paletteIndex
      ].hangar = action.payload.hangar;

      newInHangarArrivals[action.payload.arrivalIndex].palettes[
        action.payload.paletteIndex
      ].rack = null;
      state.inHangarArrivals = newInHangarArrivals;
    },

    updateInHangarArrivalPaletteRack(state, action) {
      let newInHangarArrivals = [...state.inHangarArrivals];

      newInHangarArrivals[action.payload.arrivalIndex].palettes[
        action.payload.paletteIndex
      ].rack = action.payload.rack;

      state.inHangarArrivals = newInHangarArrivals;
    },

    updateInHangarArrivalPaletteEditMode(state, action) {
      let newInHangarArrivals = [...state.inHangarArrivals];

      newInHangarArrivals[action.payload.arrivalIndex].palettes[
        action.payload.paletteIndex
      ].editMode = action.payload.editMode;

      state.inHangarArrivals = newInHangarArrivals;
    },

    updateWatchfileArrivalWatchfileLoading(state, action) {
      let newWatchfileArrivals = [...state.watchfileArrivals];

      newWatchfileArrivals[action.payload.arrivalIndex].watchfileLoading =
        action.payload.watchfileLoading;

      state.watchfileArrivals = newWatchfileArrivals;
    },

    updateWatchfileArrivalWatchfileLoaded(state, action) {
      let newWatchfileArrivals = [...state.watchfileArrivals];

      newWatchfileArrivals[action.payload.arrivalIndex].watchfileLoaded =
        action.payload.watchfileLoaded;

      state.watchfileArrivals = newWatchfileArrivals;
    },

    updateWatchfileLoadedArrivalStatus(state, action) {
      let newWatchfileArrivals = [...state.watchfileArrivals];

      newWatchfileArrivals[action.payload.arrivalIndex].status =
        action.payload.status;

      state.watchfileArrivals = newWatchfileArrivals;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: ActionWithPayload<AppState>) => {
      return {
        ...state,
        ...action.payload.arrival,
      };
    });

    builder.addCase(createNewArrival.pending, (state, action) => {
      state.newArrivalState = "pending";
    });

    builder.addCase(createNewArrival.fulfilled, (state, action) => {
      state.newArrivalState = "succeeded";
    });

    builder.addCase(createNewArrival.rejected, (state, action) => {
      state.newArrivalState = "failed";
    });

    builder.addCase(fetchInHangarArrivals.pending, (state, action) => {
      state.inHangarArrivalsLoading = "pending";
    });

    builder.addCase(fetchInHangarArrivals.fulfilled, (state, action) => {
      state.inHangarArrivals = action.payload.map((arrival) => {
        return {
          ...arrival,
          palettes: arrival.palettes.map((palette) => {
            return { ...palette, editMode: false };
          }),
        };
      });
      state.inHangarArrivalsLoading = "succeeded";
    });

    builder.addCase(fetchInHangarArrivals.rejected, (state, action) => {
      state.inHangarArrivalsLoading = "failed";
    });

    builder.addCase(fetchWatchfileLoadedArrivals.pending, (state, action) => {
      state.watchfileArrivalsLoading = "pending";
    });

    builder.addCase(fetchWatchfileLoadedArrivals.fulfilled, (state, action) => {
      state.watchfileArrivals = action.payload.map((arrival) => {
        return {
          ...arrival,
          palettes: arrival.palettes.map((palette) => {
            return { ...palette, editMode: false };
          }),
        };
      });
      state.watchfileArrivalsLoading = "succeeded";
    });

    builder.addCase(fetchWatchfileLoadedArrivals.rejected, (state, action) => {
      state.watchfileArrivalsLoading = "failed";
    });

    builder.addCase(fetchConfirmedArrivals.pending, (state, action) => {
      state.confirmedArrivalsLoading = "pending";
    });

    builder.addCase(fetchConfirmedArrivals.fulfilled, (state, action) => {
      state.confirmedArrivals = action.payload.map((arrival) => {
        return {
          ...arrival,
          palettes: arrival.palettes.map((palette) => {
            return { ...palette, editMode: false };
          }),
        };
      });
      state.confirmedArrivalsLoading = "succeeded";
    });

    builder.addCase(fetchConfirmedArrivals.rejected, (state, action) => {
      state.confirmedArrivalsLoading = "failed";
    });

    builder.addCase(resetInHangarArrivalPalette.pending, (state, action) => {
      state.resetInHangarArrivalPaletteState = "pending";
    });

    builder.addCase(resetInHangarArrivalPalette.fulfilled, (state, action) => {
      let newInHangarArrivals = [...state.inHangarArrivals];

      newInHangarArrivals[action.payload.arrivalIndex].palettes[
        action.payload.paletteIndex
      ] = { ...action.payload.palette, editMode: false };

      state.inHangarArrivals = newInHangarArrivals;
      state.resetInHangarArrivalPaletteState = "succeeded";
    });

    builder.addCase(resetInHangarArrivalPalette.rejected, (state, action) => {
      state.resetInHangarArrivalPaletteState = "failed";
    });

    builder.addCase(
      apiUpdateInHangarArrivalPalette.fulfilled,
      (state, action) => {
        let newInHangarArrivals = [...state.inHangarArrivals];

        newInHangarArrivals[action.payload.arrivalIndex].palettes[
          action.payload.paletteIndex
        ] = { ...action.payload.palette, editMode: false };

        state.inHangarArrivals = newInHangarArrivals;
      }
    );

    builder.addCase(addWatchfileToArrival.fulfilled, (state, action) => {
      let newWatchfileArrivals = [...state.watchfileArrivals];

      newWatchfileArrivals[action.payload.arrivalIndex].watchfileLoaded =
        action.payload.arrival.watchfileLoaded;

      newWatchfileArrivals[action.payload.arrivalIndex].watchfileErrors =
        action.payload.arrival.watchfileErrors;

      state.watchfileArrivals = newWatchfileArrivals;
    });

    builder.addCase(unblockArrival.fulfilled, (state, action) => {
      let newConfirmedArrivals = [...state.confirmedArrivals];

      newConfirmedArrivals[action.payload.arrivalIndex].status = "CONFIRMED";

      state.confirmedArrivals = newConfirmedArrivals;
    });

    builder.addCase(blockArrival.fulfilled, (state, action) => {
      let newConfirmedArrivals = [...state.confirmedArrivals];

      newConfirmedArrivals[action.payload.arrivalIndex].status =
        "WATCHFILE_IMPORTED";

      state.confirmedArrivals = newConfirmedArrivals;
    });

    builder.addCase(
      udpateWatchfileLoadedArrivalsLoadingState.fulfilled,
      (state, action) => {
        state.watchfileArrivals = state.watchfileArrivals.map(
          (stateArrival) => {
            const newArrival = action.payload.filter(
              (arrival) => arrival.id == stateArrival.id
            )[0];

            return {
              ...stateArrival,
              watchfileLoading: newArrival.watchfileLoading,
              watchfileLoaded: newArrival.watchfileLoaded,
              watchfileErrors: newArrival.watchfileErrors,
            };
          }
        );
        state.watchfileArrivalsLoading = "succeeded";
      }
    );
  },
});

export const {
  updateInHangarArrivalPaletteHangar,
  updateInHangarArrivalPaletteRack,
  updateInHangarArrivalPaletteEditMode,
  updateWatchfileArrivalWatchfileLoading,
  updateWatchfileArrivalWatchfileLoaded,
} = arrivalSlice.actions;

export const selectNewArrivalState = (state: AppState) =>
  state.arrival.newArrivalState;

export default arrivalSlice.reducer;
