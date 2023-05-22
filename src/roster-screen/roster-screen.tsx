import "./roster-screen.scss";

import React from "react";
import { Button } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../state/app-state";
import { UnitCardV2 } from "../unit-card/unit-card-v2";

interface RosterScreenProps {
  appState: AppState;
}

export const RosterScreen: React.FC<RosterScreenProps> = observer(
  ({ appState }) => {
    return (
      <div className="roster-screen">
        <div className="topnav">
          <Button
            text="Back"
            icon="arrow-left"
            onClick={() => appState.setCurrentScreen(AppPage.HOME)}
          />

          <span className="title">Roster</span>
        </div>

        <div className="roster-list">
          {appState.rosterUnits.map((unit, index) => (
            <UnitCardV2 key={`unit-${index}`} unit={unit} />
          ))}
        </div>
      </div>
    );
  }
);
