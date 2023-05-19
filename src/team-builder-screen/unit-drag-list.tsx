import "./unit-drag-list.scss";

import React from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Observer, observer } from "mobx-react-lite";

import { AppState } from "../app-state";
import { UnitCard } from "../unit-card/unit-card";

interface UnitDragListProps {
  appState: AppState;
}

export const UnitDragList: React.FC<UnitDragListProps> = observer(
  ({ appState }) => {
    return (
      <DragDropContext onDragEnd={appState.onTeamBuildDragEnd}>
        <Droppable droppableId="team-builder" direction="horizontal">
          {(provided) => (
            <Observer>
              {() => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="unit-list-dropzone"
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
            </Observer>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
);
