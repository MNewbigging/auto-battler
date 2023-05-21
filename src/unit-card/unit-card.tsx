import "./unit-card.scss";

import React from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

import { AnimationManager } from "../state/animation-manager";
import { GameUnit, UnitAnimation } from "../state/unit";

interface UnitCardProps {
  unit: Partial<GameUnit>;
  animationManager?: AnimationManager;
  onClick?: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = observer(
  ({ unit, onClick, animationManager }) => {
    const unitClasses = [
      "unit-card",
      unit.activationAnimating ? UnitAnimation.ACTIVATION : "",
    ];
    const healthClasses = [
      "health",
      unit.onHitAnimating ? UnitAnimation.ON_HIT : "",
    ];
    const activationCooldownClasses = [
      "cooldown",
      unit.activationCooldownAnimating ? UnitAnimation.ACTIVATION_COOLDOWN : "",
    ];

    return (
      <div
        className={unitClasses.join(" ")}
        onClick={onClick}
        onAnimationEnd={(e) => {
          unit.onUnitAnimEnd?.(UnitAnimation.ACTIVATION);
          animationManager?.onAnimationEnd(
            `${unit.id}-${UnitAnimation.ACTIVATION}`
          );
        }}
      >
        <div className="name">{unit.name}</div>

        <div
          className={healthClasses.join(" ")}
          onAnimationEnd={() => {
            unit.onUnitAnimEnd?.(UnitAnimation.ON_HIT);
            animationManager?.onAnimationEnd(
              `${unit.id}-${UnitAnimation.ON_HIT}`
            );
          }}
        >
          Health: {unit.health}
        </div>

        <div>Attack: {unit.attack}</div>

        <div
          className={activationCooldownClasses.join(" ")}
          onAnimationEnd={(e) => {
            unit.onUnitAnimEnd?.(UnitAnimation.ACTIVATION_COOLDOWN);
            animationManager?.onAnimationEnd(
              `${unit.id}-${UnitAnimation.ACTIVATION_COOLDOWN}`
            );
          }}
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
