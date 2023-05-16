import "./team-builder-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";

interface TeamBuilderProps {
  appState: AppState;
}

export const TeamBuilderScreen: React.FC<TeamBuilderProps> = observer(
  ({ appState }) => {
    return (
      <div className="team-builder-screen">
        <h2 className="bp4-heading">Team Builder</h2>

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
