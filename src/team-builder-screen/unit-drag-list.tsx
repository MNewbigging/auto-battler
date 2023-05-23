import "./unit-drag-list.scss";

import React from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@blueprintjs/core";
import { Observer, observer } from "mobx-react-lite";

import { TeamBuilderState } from "../state/team-builder-state";
import { UnitCardV2 } from "../unit-card/unit-card-v2";

interface UnitDragListProps {
  builderState: TeamBuilderState;
}

export const UnitDragList: React.FC<UnitDragListProps> = observer(
  ({ builderState }) => {
    return (
      <DragDropContext onDragEnd={builderState.onTeamBuildDragEnd}>
        <Droppable droppableId="team-builder" direction="horizontal">
          {(provided) => (
            <Observer>
              {() => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="unit-list-dropzone"
                >
                  {builderState.units.map((unit, index) => (
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
                          className="unit-wrapper"
                        >
                          <UnitCardV2 unit={unit} />
                          <div
                            className="remove-icon"
                            onClick={() =>
                              builderState.removeUnitFromTeam(index)
                            }
                          >
                            <Icon icon="cross" className="icon" />
                          </div>
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
