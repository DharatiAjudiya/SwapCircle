import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_REGISTER = "/users";
const URL_ITEM = "/items";
const URL_WISHLIST = "/wishlist";
const URL_SWAP_HISTORY = "/swap";

const api = new APIClient();

// %%%%%%%%%% EDIT USER API %%%%%%%%%%%%
export const EditUserApi = createAsyncThunk(
  "EditUserApi",
  async ({ values, id }) => {
    try {
      const response = await api.update(`${URL_REGISTER}/${id}`, values, {
        "Content-Type": "multipart/form-data",
      });
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET USER API %%%%%%%%%%%%
export const GetUserApi = createAsyncThunk("GetUserApi", async () => {
  try {
    const response = await api.get(URL_REGISTER);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET USER ITEM API %%%%%%%%%%%%
export const GetItemByUserApi = createAsyncThunk(
  "GetItemByUserApi",
  async () => {
    try {
      const response = await api.get(`/by-user${URL_ITEM}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET USER ITEM API %%%%%%%%%%%%
export const GetItemBySpecificUserApi = createAsyncThunk(
  "GetItemBySpecificUserApi",
  async ({ id }) => {
    try {
      const response = await api.get(`/by-user${URL_ITEM}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET USER WISHLIST ITEM API %%%%%%%%%%%%
// %%%%%%%%%% GET WishList API %%%%%%%%%%%%
export const GetWishListByUserApi = createAsyncThunk(
  "GetWishListByUserApi",
  async () => {
    try {
      const response = await api.get(URL_WISHLIST);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET USER API %%%%%%%%%%%%
export const GetSingleUserApi = createAsyncThunk(
  "GetSingleUserApi",
  async ({ id }) => {
    try {
      const response = await api.get(`${URL_REGISTER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET USER API %%%%%%%%%%%%
export const GetUserProfileApi = createAsyncThunk(
  "GetUserProfileApi",
  async ({ id }) => {
    try {
      const response = await api.get(`${URL_REGISTER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET USER API %%%%%%%%%%%%
export const GetSwapHistoryByUserApi = createAsyncThunk(
  "GetSwapHistoryByUserApi",
  async () => {
    try {
      const response = await api.get(`${URL_SWAP_HISTORY}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% DELETE USER API %%%%%%%%%%%%
export const DeleteUserApi = createAsyncThunk(
  "DeleteUserApi",
  async ({ id }) => {
    try {
      const response = await api.delete(`${URL_REGISTER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% DELETE USER API %%%%%%%%%%%%
export const RateUserApi = createAsyncThunk(
  "RateUserApi",
  async ({ values }) => {
    try {
      const response = await api.create(`/rate/user`, values, {});
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const UserSlice = createSlice({
  name: "UserSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    profileData: {},
    singleData: {},
    history: [],
  },
  reducers: {
    clearUserState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% EDIT USER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EditUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT USER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT SINGLE USER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT SINGLE USER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetUserProfileApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetUserProfileApi.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload?.result
          ? action.payload?.result
          : {};
      })
      .addCase(GetUserProfileApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET USER ITEM API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetItemByUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetItemByUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = {
          ...state.profileData,
          items: action.payload?.result || [],
        };
      })
      .addCase(GetItemByUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET USER ITEM API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetItemBySpecificUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetItemBySpecificUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = {
          ...state.singleData,
          items: action.payload?.result || [],
        };
      })
      .addCase(GetItemBySpecificUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET USER WISHLIST ITEM API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetWishListByUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetWishListByUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = {
          ...state.singleData,
          wishlist: action.payload?.result || [],
        };
      })
      .addCase(GetWishListByUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET USER SWAP HISTORY ITEM API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSwapHistoryByUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSwapHistoryByUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload?.result || [];
      })
      .addCase(GetSwapHistoryByUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT USER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DeleteUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% RATE USER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(RateUserApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(RateUserApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(RateUserApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearUserState } = UserSlice.actions;
export default UserSlice.reducer;
