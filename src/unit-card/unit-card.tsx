import "./unit-card.scss";

import React from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

import { GameUnit } from "../state/unit";

interface UnitCardProps {
  unit: Partial<GameUnit>;
  onClick?: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = observer(
  ({ unit, onClick }) => {
    const unitClasses = ["unit-card", unit.activationAnimating ? "active" : ""];
    const healthClasses = ["health", unit.healthAnimating ? "active" : ""];
    const activeCooldownClasses = [
      "cooldown",
      unit.activationCooldownAnimating ? "active" : "",
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
            runInAction(() => (unit.activationCooldownAnimating = false))
          }
        >
          Activates:{" "}
          {unit.activationCooldown !== undefined
            ? unit.activationCooldown
            : unit.activationSpeed}
        </div>
      </div>
    );
  }
);
