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

export function useModal() {
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

export function useCopy() {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = (copyText) => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 10000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    isCopied,
    handleCopyClick,
  };
}
