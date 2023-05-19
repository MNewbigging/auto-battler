import "./team-builder-screen.scss";

import React from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "../app-state";
import { UnitCard } from "../unit-card/unit-card";
import { UnitDragList } from "./unit-drag-list";
import { UnitList } from "../unit-list/unit-list";

interface TeamBuilderProps {
  appState: AppState;
}

export const TeamBuilderScreen: React.FC<TeamBuilderProps> = observer(
  ({ appState }) => {
    return (
      <div className="team-builder-screen">
        <h2 className="bp4-heading">Team Builder</h2>

        <div className="team-list">
          <UnitDragList appState={appState} />
        </div>

        <h3 className="bp4-heading">Available units</h3>
        <UnitList
          units={appState.allUnits}
          onClickUnit={appState.addUnitToTeam}
        />

        <div
          className="menu-item bp4-text-large"
          onClick={() => appState.setCurrentScreen(AppPage.TEAMS)}
        >
          Back
        </div>
      </div>
    );
  }
);
