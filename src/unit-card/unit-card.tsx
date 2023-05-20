import "./unit-card.scss";

import React from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

import { Unit } from "../units/unit";

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = observer(
  ({ unit, onClick }) => {
    const unitClasses = ["unit-card", unit.activationAnimating ? "active" : ""];
    const healthClasses = ["health", unit.healthAnimating ? "active" : ""];
    const activeCooldownClasses = [
      "cooldown",
      unit.activeCooldownAnimating ? "active" : "",
    ];

    return (
      <div
        className={unitClasses.join(" ")}
        onClick={onClick}
        onAnimationEnd={() =>
          runInAction(() => (unit.activationAnimating = false))
        }
      >
        <div className="name">{unit.name}</div>

        <div
          className={healthClasses.join(" ")}
          onAnimationEnd={() =>
            runInAction(() => (unit.healthAnimating = false))
          }
        >
          Health: {unit.health}
        </div>

        <div>Attack: {unit.attack}</div>

        <div
          className={activeCooldownClasses.join(" ")}
          onAnimationEnd={() =>
            runInAction(() => (unit.activeCooldownAnimating = false))
          }
        >
          Activates: {unit.activationCooldown}
        </div>
      </div>
    );
  }
);
