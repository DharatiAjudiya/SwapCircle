import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_CATEGORY = "/category";

const api = new APIClient();

// %%%%%%%%%% GET Category API %%%%%%%%%%%%
export const GetCategoryApi = createAsyncThunk("GetCategoryApi", async () => {
  try {
    const response = await api.get(URL_CATEGORY);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET Category API %%%%%%%%%%%%
export const GetSingleCategoryApi = createAsyncThunk(
  "GetSingleCategoryApi",
  async ({ id }) => {
    try {
      const response = await api.get(`${URL_CATEGORY}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% ADD Category API %%%%%%%%%%%%
export const AddCategoryApi = createAsyncThunk(
  "AddCategoryApi",
  async ({ values }) => {
    try {
      const response = await api.create(`${URL_CATEGORY}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT Category API %%%%%%%%%%%%
export const EditCategoryApi = createAsyncThunk(
  "EditCategoryApi",
  async ({ values, id }) => {
    try {
      const response = await api.update(`${URL_CATEGORY}/${id}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT Category API %%%%%%%%%%%%
export const DeleteCategoryApi = createAsyncThunk(
  "DeleteCategoryApi",
  async ({ id }) => {
    try {
      const response = await api.delete(`${URL_CATEGORY}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT Category API %%%%%%%%%%%%
export const DisableCategoryApi = createAsyncThunk(
  "DisableCategoryApi",
  async ({ id, values }) => {
    try {
      const response = await api.update(`${URL_CATEGORY}/status/${id}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const CategorySlice = createSlice({
  name: "CategorySlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearCategoryState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    //%%%%%%%%%% EDIT Category API HANDLE %%%%%%%%%%%%%%%%%%%%
    builder
      .addCase(AddCategoryApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddCategoryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddCategoryApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT Category API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditCategoryApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EditCategoryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditCategoryApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT Category API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetCategoryApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetCategoryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetCategoryApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT SINGLE Category API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleCategoryApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleCategoryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleCategoryApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE Category API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteCategoryApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DeleteCategoryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteCategoryApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DISABLE Category API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DisableCategoryApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DisableCategoryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DisableCategoryApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearCategoryState } = CategorySlice.actions;
export default CategorySlice.reducer;
