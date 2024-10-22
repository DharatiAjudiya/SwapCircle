import Cookies from "js-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../Helpers/api_helper";

const URL_LOGIN = "/login";

const api = new APIClient();

// %%%%%%%%%% lOGIN API %%%%%%%%%%%%
export const LoginApi = createAsyncThunk("LoginApi", async ({ values }) => {
  try {
    const response = await api.create(URL_LOGIN, values);
    const { data } = response;
    Cookies.set("token", data.token, { expires: 2 });
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

export const LogoutApi = createAsyncThunk("LogoutApi", async () => {
  try {
    const response = await api.get("/auth/logout");
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// //%%%%%%%%%% RESET API %%%%%%%%%%%%
// export const ResetApi = createAsyncThunk("ResetApi", async (values) => {
//   const headers = {
//     "Content-type": "application/json",
//   };
//   try {
//     const response = await axios.post(Reset_URL, values, { headers });
//     const { time_stamp, sec_code, user_id, token } = response.data.result;
//     Cookies.set("time_stamp", time_stamp, { expires: 1 / 12 });
//     Cookies.set("sec_code", sec_code, { expires: 1 / 12 });
//     Cookies.set("temp_token", token, { expires: 1 / 12 });
//     Cookies.set("user_id", user_id, { expires: 1 / 12 });

//     // Cookies.set("time_stamp",)
//     return response.data;
//   } catch (error) {
//     console.error("error", error);
//     // if (error.response.status === 500) {
//     ErrorAlert(error.response.data.message);
//     // }
//     return error.response.data;
//   }
// });
// //%%%%%%%%%% OTP API %%%%%%%%%%%%
// export const OTPAPI = createAsyncThunk(
//   "OTPAPI",
//   async ({ otp, Token, sec_code, time_stamp }) => {
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${Token}`,
//     };
//     try {
//       const urlQueeryParam = `${Verify_OTP_URL}?sec_code=${sec_code}&time_stamp=${time_stamp} `;
//       const response = await axios.post(urlQueeryParam, { otp }, { headers });
//       if (response.data.status === true) {
//         SuccessAlert(response.data.message);
//         setTimeout(() => {
//           window.location.pathname = "/confirm";
//         }, 1500);
//       } else {
//         ErrorAlert(response.data.message);
//       }
//       return response.data;
//     } catch (error) {
//       console.error("error", error);
//       // if (error.response.status === 500) {
//       ErrorAlert(error.response.data.message);
//       // }
//       return error.response.data;
//     }
//   }
// );
// //%%%%%%%%%% CHANGE PASSWORD API %%%%%%%%%%%%
// export const ChangePasswordApi = createAsyncThunk(
//   "ChangePasswordApi",
//   async ({ Token, values, id }) => {
//     const headers = {
//       "Content-type": "application/json",
//       Authorization: `Bearer ${Token}`,
//     };
//     try {
//       const response = await axios.patch(`${CONFIRM_PD_URL}/${id}`, values, {
//         headers,
//       });

//       if (response.data.status === true) {
//         SuccessAlert(response.data.message);
//         setTimeout(() => {
//           window.location.pathname = "/login";
//         }, 1500);
//       } else {
//         ErrorAlert(response.data.message);
//       }
//       return response.data;
//     } catch (error) {
//       console.error("error", error);
//       // if (error.response.status === 500) {
//       ErrorAlert(error.response.data.message);
//       // }
//       return error.response.data;
//     }
//   }
// );

const LoginSlice = createSlice({
  name: "LoginSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
  },
  reducers: {
    clearLoginState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    //%%%%%%%%%% LOGIN API HANDLE %%%%%%%%%%%%%%%%%%%%
    builder
      .addCase(LoginApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(LoginApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(LoginApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(LogoutApi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(LogoutApi.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(LogoutApi.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearLoginState } = LoginSlice.actions;
export default LoginSlice.reducer;
