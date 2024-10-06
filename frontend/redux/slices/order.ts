import { Action, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { DispatchNote, LiftWorkOrder, Order } from "@/types";

export interface OrderState {
  ordersLoading: "idle" | "pending" | "succeeded" | "failed";
  orders: Order[];

  dispatchNotesWithNoOrderLoading: "idle" | "pending" | "succeeded" | "failed";
  dispatchNotesWithNoOrder: DispatchNote[];

  liftWorkOrdersLoading: "idle" | "pending" | "succeeded" | "failed";
  liftWorkOrders: LiftWorkOrder[];
}

const initialState: OrderState = {
  ordersLoading: "idle",
  orders: [],
  dispatchNotesWithNoOrderLoading: "idle",
  dispatchNotesWithNoOrder: [],
  liftWorkOrdersLoading: "idle",
  liftWorkOrders: [],
};

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

const baseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/api`;

export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  const response = await fetch(baseUrl + `/order/all`);

  return (await response.json()) as Order[];
});

export const fetchDispatchNotesWithNoOrder = createAsyncThunk(
  "order/fetchDispatchNotesWithNoOrder",
  async () => {
    const response = await fetch(baseUrl + `/dispatch/allWithNoOrder`);
    return (await response.json()) as DispatchNote[];
  }
);

export const createOrderWithWorkOrders = createAsyncThunk<
  Order,
  {
    userId: number;
    dispatchNoteIds: number[];
  }
>("order/createOrderWithWorkOrders", async (args, thunkApi) => {
  const response = await fetch(baseUrl + `/order/createOrderWithWorkOrders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  return (await response.json()) as Order;
});

export const fetchLiftWorkOrdersInOperatorView = createAsyncThunk<
  LiftWorkOrder[],
  unknown,
  { state: AppState }
>("order/liftWorkOrdersInOperatorView", async (args, thunkApi) => {
  const userId: number | undefined = thunkApi.getState().auth.currentUser?.id;

  if (!userId) {
    return [];
  }

  const response = await fetch(
    baseUrl + `/order/liftWorkOrdersInOperatorView?userId=${userId}`
  );

  const liftWorkOrders = (await response.json()) as LiftWorkOrder[];

  return liftWorkOrders;
});

export const endLiftOrder = createAsyncThunk<
  string,
  {
    orderId: number;
    paletteIds: string[];
    parcelIds: string[];
    productIds: string[];
  }
>("order/endLiftOrder", async (args, thunkApi) => {
  const response = await fetch(baseUrl + `/order/endLiftWorkOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  return await response.json();
});

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: ActionWithPayload<AppState>) => {
      return {
        ...state,
        ...action.payload.order,
      };
    });

    builder.addCase(fetchOrders.pending, (state, action) => {
      state.ordersLoading = "pending";
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.ordersLoading = "succeeded";
      state.orders = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.ordersLoading = "failed";
    });

    builder.addCase(fetchDispatchNotesWithNoOrder.pending, (state, action) => {
      state.dispatchNotesWithNoOrderLoading = "pending";
    });
    builder.addCase(
      fetchDispatchNotesWithNoOrder.fulfilled,
      (state, action) => {
        state.dispatchNotesWithNoOrderLoading = "succeeded";
        state.dispatchNotesWithNoOrder = action.payload;
      }
    );
    builder.addCase(fetchDispatchNotesWithNoOrder.rejected, (state, action) => {
      state.dispatchNotesWithNoOrderLoading = "failed";
    });

    builder.addCase(
      fetchLiftWorkOrdersInOperatorView.pending,
      (state, action) => {
        state.liftWorkOrdersLoading = "pending";
      }
    );
    builder.addCase(
      fetchLiftWorkOrdersInOperatorView.fulfilled,
      (state, action) => {
        state.liftWorkOrdersLoading = "succeeded";
        state.liftWorkOrders = action.payload;
      }
    );
    builder.addCase(
      fetchLiftWorkOrdersInOperatorView.rejected,
      (state, action) => {
        state.liftWorkOrdersLoading = "failed";
      }
    );
  },
});

export default orderSlice.reducer;
