import "./unit-card-v2.scss";

import React from "react";
import { Tooltip2 } from "@blueprintjs/popover2";

import { GameUnit } from "../state/unit";

interface UnitCardV2Props {
  unit: Partial<GameUnit>;
  onClick?: () => void;
}

export const UnitCardV2: React.FC<UnitCardV2Props> = ({ unit, onClick }) => {
  return (
    <div className={"unit-card-v2"} onClick={onClick}>
      <div className={"health-wrapper"}>
        <Tooltip2 className="content" position="top" content="health">
          {unit.health}
        </Tooltip2>
      </div>

      <div className="attack-wrapper bp4-elevation-1">
        <Tooltip2 className="content" position="top" content="attack damage">
          {unit.attack}
        </Tooltip2>
      </div>

      {unit.activationSteps && unit.activationSteps > 1 && (
        <div className="frenzy-wrapper bp4-elevation-1">
          <Tooltip2
            className="content"
            position="top"
            content="no. of attacks per turn"
          >
            {unit.activationSteps}
          </Tooltip2>
        </div>
      )}

      <div className={"activation-cooldown-wrapper"}>
        <Tooltip2
          className="content"
          position="top"
          content="how many turns until this unit attacks"
        >
          <div className="content">
            {unit.activationCooldown !== undefined
              ? unit.activationCooldown
              : unit.activationSpeed}
          </div>
        </Tooltip2>
      </div>

      <div className="card-body bp4-elevation-2">
        <div className="card-image"></div>
        <div className="card-name">{unit.name}</div>
        <div className="card-blurb"></div>
      </div>
    </div>
  );
};
