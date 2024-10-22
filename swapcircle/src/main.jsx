import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../stores/store.js";
import { ToastProvider } from "../stores/ToastContext.jsx";
import { SocketProvider } from "./Socket.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <SocketProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SocketProvider>
    </Provider>
  </BrowserRouter>
);
