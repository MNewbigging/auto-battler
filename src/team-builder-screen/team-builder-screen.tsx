import "./team-builder-screen.scss";

import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

import { TeamBuilderState } from "../state/team-builder-state";
import { UnitCard } from "../unit-card/unit-card";
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

          <Button
            text="Save team"
            icon="tick"
            intent={Intent.PRIMARY}
            onClick={onSave}
          />
        </div>

        <h2 className="header">Team Builder</h2>

        <div className="team-list">
          {builderState.units.length === 0 && (
            <span>
              Click a unit below to add it to the team, then drag to reorder
            </span>
          )}
          <UnitDragList builderState={builderState} />
        </div>

        <div className="roster-area">
          <h3 className="bp4-heading">Available units</h3>
          <div className="roster-list">
            {builderState.rosterUnits.map((unit, index) => (
              <motion.div whileHover={{ scale: 1.1 }}>
                <UnitCardV2
                  key={`roster-unit-${index}`}
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
