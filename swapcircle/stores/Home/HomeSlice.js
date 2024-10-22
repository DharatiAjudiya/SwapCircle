import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_HOME = "/homepage";

const api = new APIClient();

// %%%%%%%%%% GET Swap API %%%%%%%%%%%%
export const GetHomeApi = createAsyncThunk("GetHomeApi", async () => {
  try {
    const response = await api.get(URL_HOME);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

const HomeSlice = createSlice({
  name: "HomeSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    topUsers: [],
    topRatedProducts: [],
    categories: [],
  },
  reducers: {
    clearHomeState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    //%%%%%%%%%% EDIT Swap API HANDLE %%%%%%%%%%%%%%%%%%%%
    builder
      .addCase(GetHomeApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetHomeApi.fulfilled, (state, action) => {
        state.loading = false;
        state.topUsers = action.payload.topUsers;
        state.topRatedProducts = action.payload.topRatedProducts;
        state.categories = action.payload.categories;
      })
      .addCase(GetHomeApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearHomeState } = HomeSlice.actions;
export default HomeSlice.reducer;
