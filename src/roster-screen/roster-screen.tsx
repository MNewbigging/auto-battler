import "./roster-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";

interface RosterScreenProps {
  appState: AppState;
}

export const RosterScreen: React.FC<RosterScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="roster-screen">
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
