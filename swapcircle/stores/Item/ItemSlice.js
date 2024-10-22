import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_ITEMS = "/items";

const api = new APIClient();

// %%%%%%%%%% GET Item API %%%%%%%%%%%%
export const GetItemApi = createAsyncThunk("GetItemApi", async () => {
  try {
    const response = await api.get(URL_ITEMS);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET Item API %%%%%%%%%%%%
export const GetSingleItemApi = createAsyncThunk(
  "GetSingleItemApi",
  async ({ id }) => {
    try {
      const response = await api.get(`${URL_ITEMS}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% ADD Item API %%%%%%%%%%%%
export const AddItemApi = createAsyncThunk("AddItemApi", async ({ values }) => {
  try {
    const response = await api.create(`${URL_ITEMS}`, values, {
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% EDIT Item API %%%%%%%%%%%%
export const EditItemApi = createAsyncThunk(
  "EditItemApi",
  async ({ values, id }) => {
    try {
      const response = await api.update(`${URL_ITEMS}/${id}`, values, {
        "Content-Type": "multipart/form-data",
      });
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT Item API %%%%%%%%%%%%
export const DeleteItemApi = createAsyncThunk(
  "DeleteItemApi",
  async ({ id }) => {
    try {
      const response = await api.delete(`${URL_ITEMS}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const ItemSlice = createSlice({
  name: "ItemSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearItemState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    //%%%%%%%%%% EDIT Item API HANDLE %%%%%%%%%%%%%%%%%%%%
    builder
      .addCase(AddItemApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddItemApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT Item API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditItemApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EditItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditItemApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT Item API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetItemApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetItemApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT SINGLE Item API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleItemApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleItemApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE Item API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteItemApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DeleteItemApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteItemApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearItemState } = ItemSlice.actions;
export default ItemSlice.reducer;
