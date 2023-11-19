import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));
export const socket = io(serverUrl, {
  autoConnect: false,
});
root.render(
  <React.StrictMode>
    <ToastContainer />
    <App server={serverUrl} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default function useModal() {
  const [visible, setVisible] = useState(false);

  function toggle() {
    if (visible) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }
  return { visible, toggle };
}
