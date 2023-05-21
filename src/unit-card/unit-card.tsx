import "./unit-card.scss";

import React from "react";
import { observer } from "mobx-react-lite";

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
      unit.defeatAnimating ? UnitAnimation.DEFEATED : "",
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
          // Temporary while this one node has multiple potential anims
          let anim =
            e.animationName === "pulse"
              ? UnitAnimation.ACTIVATION
              : UnitAnimation.DEFEATED;

          unit.onUnitAnimEnd?.(anim);
          animationManager?.onAnimationEnd(`${unit.id}-${anim}`);
        }}
      >
        <div className="name">{unit.name}</div>

        <div
          className={healthClasses.join(" ")}
          onAnimationEnd={(e) => {
            e.stopPropagation();
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
            e.stopPropagation();
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
