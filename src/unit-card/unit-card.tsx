import "./unit-card.scss";

import React from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

import { AnimationManagerV2 } from "../state/animation-manager-v2";
import { GameUnit } from "../state/unit";

interface UnitCardProps {
  unit: Partial<GameUnit>;
  animationManager?: AnimationManagerV2;
  onClick?: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = observer(
  ({ unit, onClick, animationManager }) => {
    const unitClasses = [
      "unit-card",
      unit.activationAnimating ? "active" : "",
      unit.defeatAnimating ? "defeated" : "",
    ];
    const healthClasses = ["health", unit.healthAnimating ? "active" : ""];
    const activeCooldownClasses = [
      "cooldown",
      unit.activationCooldownAnimating ? "active" : "",
    ];

    return (
      <div
        className={unitClasses.join(" ")}
        onClick={onClick}
        onAnimationEnd={unit.onUnitAnimEnd}
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
            animationManager?.onAnimationEnd(`${unit.id}-cooldown`)
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
