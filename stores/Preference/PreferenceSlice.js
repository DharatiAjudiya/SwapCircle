import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_SIMILAR_ITEMS = "/similaritem/product";
const URL_CUSTOMER_LIKED = "/customer/alsoliked";

const api = new APIClient();

// %%%%%%%%%% GET Swap API %%%%%%%%%%%%
export const GetSimilarItemApi = createAsyncThunk(
  "GetSimilarItemApi",
  async ({ id, name, categoryId }) => {
    try {
      const response = await api.get(
        `${URL_SIMILAR_ITEMS}?categoryId=${categoryId}&itemName=${name}&itemId=${id}`
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET Swap API %%%%%%%%%%%%
export const GetCustomerLikedApi = createAsyncThunk(
  "GetCustomerLikedApi",
  async ({ id, categoryId }) => {
    try {
      const response = await api.get(
        `${URL_CUSTOMER_LIKED}?itemId=${id}&categoryId=${categoryId}`
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const PreferenceSlice = createSlice({
  name: "PreferenceSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    spData: [],
    clData: [],
  },
  reducers: {
    clearPreferenceState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(GetSimilarItemApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSimilarItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.spData = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetSimilarItemApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      .addCase(GetCustomerLikedApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetCustomerLikedApi.fulfilled, (state, action) => {
        state.loading = false;
        state.clData = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetCustomerLikedApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearPreferenceState } = PreferenceSlice.actions;
export default PreferenceSlice.reducer;
