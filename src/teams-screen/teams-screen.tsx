import "./teams-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";
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
              <div>Team {teamIdx + 1}</div>
              {team.map((unit, unitIdx) => (
                <UnitCard key={`team-${teamIdx}-unit-${unitIdx}`} unit={unit} />
              ))}
            </div>
          ))}
        </div>

        <div
          className="menu-item bp4-text-large"
          onClick={() => appState.setCurrentScreen(AppPage.TEAM_BUILDER)}
        >
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
