import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import { NODE_APP_URL } from "../config/app_config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () => io(NODE_APP_URL, { withCredentials: true }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
