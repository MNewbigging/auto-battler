import "./play-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";

interface PlayScreenProps {
  appState: AppState;
}

export const PlayScreen: React.FC<PlayScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="play-screen">
        <div
          className="menu-item bp4-text-large"
          onClick={() => appState.setCurrentScreen(AppPage.HOME)}
        >
          Back
        </div>
      </div>
    );
  }
);
