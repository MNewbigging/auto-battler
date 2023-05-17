import "./roster-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";
import { UnitCard } from "../unit-card/unit-card";

interface RosterScreenProps {
  appState: AppState;
}

export const RosterScreen: React.FC<RosterScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="roster-screen">
        <h2 className="bp4-heading">Roster</h2>

        <div className="unit-list">
          {appState.allUnits.map((unit, index) => (
            <UnitCard key={`unit-${index}`} unit={unit} />
          ))}
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
