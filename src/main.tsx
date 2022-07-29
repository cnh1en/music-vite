import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PlayerContextProvider } from "./context/PlayerContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlayerContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PlayerContextProvider>
  </React.StrictMode>
);
