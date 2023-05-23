import "./team-builder-screen.scss";

import React from "react";
import { Button, InputGroup, Intent } from "@blueprintjs/core";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

import { TeamBuilderState } from "../state/team-builder-state";
import { UnitCardV2 } from "../unit-card/unit-card-v2";
import { UnitDragList } from "./unit-drag-list";

interface TeamBuilderProps {
  builderState: TeamBuilderState;
  onSave: () => void;
  onCancel: () => void;
}

export const TeamBuilderScreen: React.FC<TeamBuilderProps> = observer(
  ({ builderState, onSave, onCancel }) => {
    return (
      <div className="team-builder-screen">
        <div className="topnav">
          <Button
            text="Cancel"
            intent={Intent.DANGER}
            icon="arrow-left"
            onClick={onCancel}
          />

          <span className="title">Team Builder</span>

          <Button
            text="Save team"
            icon="tick"
            intent={Intent.PRIMARY}
            onClick={onSave}
          />
        </div>

        <div className="team-area">
          <div className="top-row">
            <div className="team-name">
              Team name:{" "}
              <InputGroup
                value={builderState.teamName}
                onChange={(event) => builderState.setName(event.target.value)}
              />
            </div>
          </div>

          <div className="team-list">
            {builderState.units.length === 0 && (
              <span style={{ marginLeft: "auto", marginRight: "auto" }}>
                Click a unit below to add it to the team, then drag to reorder.
                Click a unit in the team to remove it.
              </span>
            )}

            <UnitDragList builderState={builderState} />
          </div>
        </div>

        <div className="roster-area">
          <h3 className="bp4-heading">Available units</h3>
          <div className="roster-list">
            {builderState.rosterUnits.map((unit, index) => (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }}
                key={`roster-unit-${index}`}
              >
                <UnitCardV2
                  unit={unit}
                  onClick={() => builderState.addUnitToTeam(unit)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
