import "./unit-list.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { Unit } from "../units/unit";
import { UnitCard } from "../unit-card/unit-card";

interface UnitListProps {
  units: Unit[];
  onClickUnit?: (unit: Unit) => void;
}

export const UnitList: React.FC<UnitListProps> = observer(
  ({ units, onClickUnit }) => {
    return (
      <div className="unit-list">
        {units.map((unit, index) => (
          <UnitCard
            key={`unit-${index}`}
            unit={unit}
            onClick={() => onClickUnit?.(unit)}
          />
        ))}
      </div>
    );
  }
);
