import { Action, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { DispatchNote, User } from "@/types";

export interface AuthState {
  currentUser: User | null;
  usersLoadingState: "idle" | "pending" | "succeeded" | "failed";
  users: User[];
}

const initialState: AuthState = {
  currentUser: null,
  usersLoadingState: "idle",
  users: [],
};

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

const baseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/api`;

export const fetchUsers = createAsyncThunk<
  User[],
  {
    authToken: string;
  },
  {}
>("arrival/fetchUsers", async (args, thunkApi): Promise<User[]> => {
  const response = await fetch(baseUrl + `/auth/getAllUsers`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + args.authToken,
    },
  });

  return (await response.json()) as User[];
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload.currentUser;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: ActionWithPayload<AppState>) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    });

    builder.addCase(fetchUsers.pending, (state, action) => {
      state.usersLoadingState = "pending";
    });

    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;

      state.usersLoadingState = "succeeded";
    });

    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.usersLoadingState = "failed";
    });
  },
});

export const { setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
