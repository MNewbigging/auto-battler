import "./team-builder-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { TeamBuilderState } from "../state/team-builder-state";
import { UnitCard } from "../unit-card/unit-card";
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
        <h2 className="bp4-heading">Team Builder</h2>

        <div className="team-list">
          {builderState.units.length === 0 && (
            <span>
              Click a unit below to add it to the team, then drag to reorder
            </span>
          )}
          <UnitDragList builderState={builderState} />
        </div>

        <h3 className="bp4-heading">Available units</h3>
        <div className="roster-list">
          {builderState.rosterUnits.map((unit, index) => (
            <UnitCard
              key={`roster-unit-${index}`}
              unit={unit}
              onClick={() => builderState.addUnitToTeam(unit)}
            />
          ))}
        </div>

        <div className="menu-item bp4-text-large" onClick={onSave}>
          Save team
        </div>
        <div className="menu-item bp4-text-large" onClick={onCancel}>
          Back
        </div>
      </div>
    );
  }
);
