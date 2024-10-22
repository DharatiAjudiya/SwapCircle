import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_ITEMS = "/items";

const api = new APIClient();

// %%%%%%%%%% GET Shop API %%%%%%%%%%%%
export const GetShopByCatgoryApi = createAsyncThunk(
  "GetShopByCatgoryApi",
  async ({ values, id, page }) => {
    try {
      const response = await api.create(
        `${URL_ITEMS}/filtering/${id}?page=${page}`,
        values
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);
export const GetShopApi = createAsyncThunk(
  "GetShopApi",
  async ({ values, page }) => {
    try {
      const response = await api.create(`/itemlisting?page=${page}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const shopSlice = createSlice({
  name: "shopSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    page: 1,
    totalPages: 0,
  },
  reducers: {
    clearShopState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    decrementPage: (state) => {
      state.page -= 1;
    },
    resetPage: (state) => {
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    //%%%%%%%%%%  Shop API HANDLE %%%%%%%%%%%%%%%%%%%%
    builder
      //%%%%%%%%%% GET Shop BY CATEGORY API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetShopByCatgoryApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetShopByCatgoryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
        state.totalPages = action.payload?.totalPages
          ? action.payload?.totalPages
          : [];
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(GetShopByCatgoryApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% SHOP API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetShopApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetShopApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
        state.totalPages = action.payload?.totalPages
          ? action.payload?.totalPages
          : [];
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(GetShopApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearShopState, decrementPage, incrementPage, resetPage } =
  shopSlice.actions;
export default shopSlice.reducer;
