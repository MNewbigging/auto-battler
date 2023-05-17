import "./unit-list.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { Unit } from "../units/unit";
import { UnitCard } from "../unit-card/unit-card";

interface UnitListProps {
  units: Unit[];
}

export const UnitList: React.FC<UnitListProps> = observer(({ units }) => {
  return (
    <div className="unit-list">
      {units.map((unit, index) => (
        <UnitCard key={`unit-${index}`} unit={unit} />
      ))}
    </div>
  );
});
