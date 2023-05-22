import "./play-screen.scss";

import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../state/app-state";
import { TeamSelector } from "./team-selector";

interface PlayScreenProps {
  appState: AppState;
}

export const PlayScreen: React.FC<PlayScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="play-screen">
        <div className="topnav">
          <Button
            text="Back"
            icon="arrow-left"
            onClick={() => appState.setCurrentScreen(AppPage.HOME)}
          />

          <Button
            text="Start game"
            icon="play"
            intent={Intent.PRIMARY}
            onClick={() => appState.playTest()}
            disabled={!appState.bothTeamsSet()}
          />
        </div>

        <div className="header">Play</div>

        <div className="left-team">
          <TeamSelector
            teams={appState.teams}
            onTeamSelect={appState.setLeftTeam}
            buttonText={appState.leftTeam?.name}
          />

          <div className="vs">VS</div>
        </div>

        <div className="right-team">
          <TeamSelector
            teams={appState.teams}
            onTeamSelect={appState.setRightTeam}
            buttonText={appState.rightTeam?.name}
          />
        </div>
      </div>
    );
  }
);
