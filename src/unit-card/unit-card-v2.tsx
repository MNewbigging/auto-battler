import "./unit-card-v2.scss";

import React from "react";
import { Tooltip2 } from "@blueprintjs/popover2";

import { AnimationManager } from "../state/animation-manager";
import { GameUnit, UnitAnimation } from "../state/unit";

interface UnitCardV2Props {
  unit: Partial<GameUnit>;
  animationManager?: AnimationManager;
  onClick?: () => void;
}

export const UnitCardV2: React.FC<UnitCardV2Props> = ({
  unit,
  animationManager,
  onClick,
}) => {
  const unitClasses = [
    "unit-card-v2",
    unit.activationAnimating ? UnitAnimation.ACTIVATION : "",
    unit.defeatAnimating ? UnitAnimation.DEFEATED : "",
  ];
  const healthClasses = [
    "health-wrapper",
    "bp4-elevation-1",
    unit.onHitAnimating ? UnitAnimation.ON_HIT : "",
  ];
  const activationCooldownClasses = [
    "activation-cooldown-wrapper",
    "bp4-elevation-1",
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
        <Tooltip2 className="content" position="top" content="health">
          {unit.health}
        </Tooltip2>
      </div>

      <div className="attack-wrapper bp4-elevation-1">
        <Tooltip2 className="content" position="top" content="attack damage">
          {unit.attack}
        </Tooltip2>
      </div>

      {unit.activationSteps && unit.activationSteps > 1 && (
        <div className="frenzy-wrapper bp4-elevation-1">
          <Tooltip2
            className="content"
            position="top"
            content="no. of attacks per turn"
          >
            {unit.activationSteps}
          </Tooltip2>
        </div>
      )}

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
        <Tooltip2
          className="content"
          position="top"
          content="how many turns until this unit attacks"
        >
          <div
            className="content"
            onAnimationEnd={(e) => {
              e.stopPropagation();
              unit.onUnitAnimEnd?.(UnitAnimation.ACTIVATION_COOLDOWN);
              animationManager?.onAnimationEnd(
                `${unit.id}-${UnitAnimation.ACTIVATION_COOLDOWN}`
              );
            }}
          >
            {unit.activationCooldown !== undefined
              ? unit.activationCooldown
              : unit.activationSpeed}
          </div>
        </Tooltip2>
      </div>

      <div className="card-body bp4-elevation-2">
        <div className="card-image"></div>
        <div className="card-name">{unit.name}</div>
        <div className="card-blurb"></div>
      </div>
    </div>
  );
};
