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
          <DragDropContext onDragEnd={appState.onTeamBuildDragEnd}>
            <Droppable droppableId="team-builder" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="team-dropzone"
                >
                  {appState.teamBuilderUnits.map((unit, index) => (
                    <Draggable
                      draggableId={`team-${unit.name}-${index}`}
                      index={index}
                      key={`team-unit-${index}`}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <UnitCard unit={unit} />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
