import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_SWAP = "/swap";

const api = new APIClient();

// %%%%%%%%%% GET Swap API %%%%%%%%%%%%
export const GetSwapApi = createAsyncThunk("GetSwapApi", async () => {
  try {
    const response = await api.get(URL_SWAP);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET Swap API %%%%%%%%%%%%
export const GetSingleSwapApi = createAsyncThunk(
  "GetSingleSwapApi",
  async ({ id }) => {
    try {
      const response = await api.get(`${URL_SWAP}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% ADD Swap API %%%%%%%%%%%%
export const AddSwapApi = createAsyncThunk(
  "AddSwapApi",
  async ({ values }) => {
    try {
      const response = await api.create(`${URL_SWAP}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT Swap API %%%%%%%%%%%%
export const EditSwapApi = createAsyncThunk(
  "EditSwapApi",
  async ({ values, id }) => {
    try {
      const response = await api.update(`${URL_SWAP}/${id}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT Swap API %%%%%%%%%%%%
export const DeleteSwapApi = createAsyncThunk(
  "DeleteSwapApi",
  async ({ id }) => {
    try {
      const response = await api.delete(`${URL_SWAP}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const SwapSlice = createSlice({
  name: "SwapSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearSwapState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    //%%%%%%%%%% EDIT Swap API HANDLE %%%%%%%%%%%%%%%%%%%%
    builder
      .addCase(AddSwapApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddSwapApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddSwapApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT Swap API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditSwapApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EditSwapApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditSwapApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT Swap API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetSwapApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSwapApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetSwapApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT SINGLE Swap API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleSwapApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleSwapApi.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleSwapApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE Swap API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteSwapApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DeleteSwapApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteSwapApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearSwapState } = SwapSlice.actions;
export default SwapSlice.reducer;
