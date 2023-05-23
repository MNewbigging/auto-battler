import "./teams-screen.scss";

import React from "react";
import { Button, Intent, Position } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
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

          <span className="title">Teams</span>

          <Button
            text="Build team"
            icon="build"
            intent={Intent.PRIMARY}
            onClick={appState.buildTeam}
          />
        </div>

        <div className="teams-list">
          {appState.teams.map((team, teamIdx) => (
            <div className="team" key={`team-${teamIdx}`}>
              <div className="team-name">
                <div>{team.name}</div>
                <div className="team-actions">
                  <Tooltip2 position={Position.BOTTOM} content="Edit team">
                    <Button
                      icon="edit"
                      onClick={() => appState.editTeam(team.id)}
                    />
                  </Tooltip2>

                  <Tooltip2 position={Position.BOTTOM} content="Delete team">
                    <Button
                      icon="trash"
                      onClick={() => appState.deleteTeam(team.id)}
                    />
                  </Tooltip2>
                </div>
              </div>

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
