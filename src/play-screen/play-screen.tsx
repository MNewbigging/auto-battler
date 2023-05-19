import "./play-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";
import { TeamSelector } from "./team-selector";

interface PlayScreenProps {
  appState: AppState;
}

export const PlayScreen: React.FC<PlayScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="play-screen">
        <h2 className="bp4-heading">Play</h2>

        <div className="team-picker-area">
          <TeamSelector
            teams={appState.teams}
            onTeamSelect={appState.setLeftTeam}
            buttonText={appState.leftTeam?.name}
          />
          VS
          <TeamSelector
            teams={appState.teams}
            onTeamSelect={appState.setRightTeam}
            buttonText={appState.rightTeam?.name}
          />
        </div>

        <div
          className="menu-item bp4-text-large"
          onClick={() => appState.play()}
        >
          Play
        </div>
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
