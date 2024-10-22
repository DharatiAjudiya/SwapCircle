import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../Helpers/PreventScroll";
import { NEW_MESSAGE_ALERT } from "../../src/constants/events";
import { APIClient } from "../../Helpers/api_helper";

const URL_LOGIN = "/login";

const api = new APIClient();

export const fetchMessages = createAsyncThunk(
  "api/fetchMessages",
  async ({ chatId, page }) => {
    try {
      const response = await api.get(`/message/${chatId}?page=${page}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

export const sendAttachments = createAsyncThunk(
  "api/sendAttachments",
  async (data) => {
    try {
      const response = await api.create("/message/attachment", data, {
        "Content-Type": "multipart/form-data",
      });
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

export const sendItems = createAsyncThunk("api/sendItems", async (data) => {
  try {
    const response = await api.create("/message/item", data);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

export const denyProposal = createAsyncThunk(
  "api/denyProposal",
  async ({ values, id }) => {
    try {
      const response = await api.update(`/message/status/deny/${id}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

export const makeSwap = createAsyncThunk("api/makeSwap", async ({ data }) => {
  try {
    const response = await api.create(`/swap`, data);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

const initialState = {
  status: false,
  loading: null,
  message: "",
  messages: [],
  totalPages: 0,
};

const MessageSlice = createSlice({
  name: "MessageSlice",
  initialState,
  reducers: {
    clearMessageState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(sendAttachments.fulfilled, (state, action) => {
        // Handle state update for sendAttachments if necessary
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(sendItems.fulfilled, (state, action) => {
        // Handle state update for sendAttachments if necessary
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(denyProposal.fulfilled, (state, action) => {
        // Handle state update for sendAttachments if necessary
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(makeSwap.fulfilled, (state, action) => {
        // Handle state update for sendAttachments if necessary
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearMessageState } = MessageSlice.actions;
export default MessageSlice.reducer;
