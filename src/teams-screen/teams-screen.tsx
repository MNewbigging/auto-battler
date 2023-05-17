import "./teams-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";

interface TeamsScreenProps {
  appState: AppState;
}

export const TeamsScreen: React.FC<TeamsScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="teams-screen">
        <h2 className="bp4-heading">Teams</h2>

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
