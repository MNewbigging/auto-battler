import "./unit-drag-list.scss";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
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
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                          >
                            <UnitCardV2
                              unit={unit}
                              onClick={() =>
                                builderState.removeUnitFromTeam(index)
                              }
                            />
                          </motion.div>
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
