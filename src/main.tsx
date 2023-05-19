import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { AppState } from "./app-state";

const appState = new AppState();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App appState={appState} />
);
