import "./unit-card.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { Unit } from "../units/unit";

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = observer(
  ({ unit, onClick }) => {
    const healthClasses = ["health", unit.healthAnimating ? "active" : ""];
    const activeCooldownClasses = [
      "cooldown",
      unit.activeCooldownAnimating ? "active" : "",
    ];
    console.log("unit render", unit);

    return (
      <div className="unit-card" onClick={onClick}>
        <div className="name">{unit.name}</div>
        <div className={healthClasses.join(" ")}>Health: {unit.health}</div>
        <div>Attack: {unit.attack}</div>
        <div className={activeCooldownClasses.join(" ")}>
          Activates: {unit.activationCooldown}
        </div>
      </div>
    );
  }
);
