import "./unit-card.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { Unit } from "../units/unit";

interface UnitCardProps {
  unit: Unit;
}

export const UnitCard: React.FC<UnitCardProps> = observer(({ unit }) => {
  return (
    <div className="unit-card">
      <div className="name">{unit.name}</div>
      <div>Health: {unit.health}</div>
      <div>Attack: {unit.attack}</div>
      <div>Speed: {unit.activationSpeed}</div>
    </div>
  );
});
