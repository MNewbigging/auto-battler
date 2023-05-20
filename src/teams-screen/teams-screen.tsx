import "./teams-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../state/app-state";
import { UnitCard } from "../unit-card/unit-card";

interface TeamsScreenProps {
  appState: AppState;
}

export const TeamsScreen: React.FC<TeamsScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="teams-screen">
        <h2 className="bp4-heading">Teams</h2>

        <div className="teams-list">
          {appState.teams.map((team, teamIdx) => (
            <div className="team" key={`team-${teamIdx}`}>
              <div>{team.name}</div>
              <div className="team-unit-list">
                {team.units.map((unit, unitIdx) => (
                  <UnitCard
                    key={`team-${teamIdx}-unit-${unitIdx}`}
                    unit={unit}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="menu-item bp4-text-large" onClick={appState.buildTeam}>
          Build team
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
