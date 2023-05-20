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
    return (
      <div className="unit-card" onClick={onClick}>
        <div className="name">{unit.name}</div>
        <div>Health: {unit.health}</div>
        <div>Attack: {unit.attack}</div>
        <div>Activates: {unit.activationCooldown}</div>
      </div>
    );
  }
);
