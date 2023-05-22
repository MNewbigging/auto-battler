import "./teams-screen.scss";

import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../state/app-state";
import { UnitCardV2 } from "../unit-card/unit-card-v2";

interface TeamsScreenProps {
  appState: AppState;
}

export const TeamsScreen: React.FC<TeamsScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="teams-screen">
        <div className="topnav">
          <Button
            text="Back"
            icon="arrow-left"
            onClick={() => appState.setCurrentScreen(AppPage.HOME)}
          />

          <Button
            text="Build team"
            icon="build"
            intent={Intent.PRIMARY}
            onClick={appState.buildTeam}
          />
        </div>

        <div className="header">Teams</div>

        <div className="teams-list">
          {appState.teams.map((team, teamIdx) => (
            <div className="team" key={`team-${teamIdx}`}>
              <div className="team-name">{team.name}</div>
              <div className="team-unit-list">
                {team.units.map((unit, unitIdx) => (
                  <UnitCardV2
                    key={`team-${teamIdx}-unit-${unitIdx}`}
                    unit={unit}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
