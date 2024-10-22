import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../Helpers/PreventScroll";
import { NEW_MESSAGE_ALERT } from "../../src/constants/events";
import { APIClient } from "../../Helpers/api_helper";

const api = new APIClient();

const URL_CHATROOM = "/chatroom";

export const fetchMyChats = createAsyncThunk("api/fetchMyChats", async () => {
  try {
    const response = await api.get(`${URL_CHATROOM}/my`);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

export const AddChatRoomApi = createAsyncThunk(
  "AddChatRoomApi",
  async ({ values }) => {
    try {
      const response = await api.create(`${URL_CHATROOM}`, values);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

export const fetchChatDetails = createAsyncThunk(
  "api/fetchChatDetails",
  async ({ chatId, populate = false }) => {
    try {
      const url = `${URL_CHATROOM}/${chatId}${
        populate ? "?populate=true" : ""
      }`;
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const initialState = {
  status: null,
  loading: false,
  message: "",
  chats: [],
  singleChat: {},
  notificationCount: 0,
  newMessagesAlert: getOrSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const ChatroomSlice = createSlice({
  name: "ChatroomSlice",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationCount += 1;
    },
    resetNotificationCount: (state) => {
      state.notificationCount = 0;
    },

    setNewMessagesAlert: (state, action) => {
      const chatId = action.payload.chatId;

      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === chatId
      );

      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId,
          count: 1,
        });
      }
    },

    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },

    clearChatroomState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
      // state.chats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyChats.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchMyChats.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(fetchMyChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.result;
      })
      .addCase(fetchChatDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchChatDetails.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(fetchChatDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = state.chats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );
      })
      .addCase(AddChatRoomApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddChatRoomApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.singleChat = action.payload.result;
      })
      .addCase(AddChatRoomApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export default ChatroomSlice.reducer;
export const {
  incrementNotification,
  resetNotificationCount,
  setNewMessagesAlert,
  removeNewMessagesAlert,
  clearChatroomState,
} = ChatroomSlice.actions;
