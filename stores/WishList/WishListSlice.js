import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_WISHLIST = "/wishlist";

const api = new APIClient();

// %%%%%%%%%% GET WishList API %%%%%%%%%%%%
export const GetWishListApi = createAsyncThunk("GetWishListApi", async () => {
  try {
    const response = await api.get(URL_WISHLIST);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET WishList API %%%%%%%%%%%%
export const GetSingleWishListApi = createAsyncThunk(
  "GetSingleWishListApi",
  async ({ id }) => {
    try {
      const response = await api.get(`${URL_WISHLIST}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% ADD WishList API %%%%%%%%%%%%
export const AddWishListApi = createAsyncThunk(
  "AddWishListApi",
  async ({ values, id }) => {
    try {
      const response = await api.create(`${URL_WISHLIST}/${id}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT WishList API %%%%%%%%%%%%
export const EditWishListApi = createAsyncThunk(
  "EditWishListApi",
  async ({ values, id }) => {
    try {
      const response = await api.update(`${URL_WISHLIST}/${id}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT WishList API %%%%%%%%%%%%
export const DeleteWishListApi = createAsyncThunk(
  "DeleteWishListApi",
  async ({ id }) => {
    try {
      const response = await api.delete(`${URL_WISHLIST}/remove/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const WishListSlice = createSlice({
  name: "WishListSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearWishListState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    //%%%%%%%%%% EDIT WishList API HANDLE %%%%%%%%%%%%%%%%%%%%
    builder
      .addCase(AddWishListApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddWishListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddWishListApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT WishList API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditWishListApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EditWishListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditWishListApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT WishList API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetWishListApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetWishListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetWishListApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT SINGLE WishList API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleWishListApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleWishListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleWishListApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE WishList API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteWishListApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DeleteWishListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteWishListApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearWishListState } = WishListSlice.actions;
export default WishListSlice.reducer;
