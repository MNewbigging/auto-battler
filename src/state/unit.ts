import { AnimationEvent } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";

import { GameTeam } from "./team";
import { createId } from "../utils/utils";

// Base units are used in the roster
export interface BaseUnit {
  name: string;
  health: number;
  attack: number;
  activationSpeed: number;
  activationSteps: number;
}

// A Built Unit exists in a team
export class BuiltUnit implements BaseUnit {
  name: string;
  @observable health: number;
  @observable healthAnimating = false;
  @observable attack: number;
  @observable attackAnimating = false;
  @observable activationSpeed: number;
  @observable activationSpeedAnimating = false;
  @observable activationSteps: number;

  constructor(public baseUnit: BaseUnit) {
    makeAutoObservable(this);

    // Props are initialised from the base unit values
    this.name = baseUnit.name;
    this.health = baseUnit.health;
    this.attack = baseUnit.attack;
    this.activationSpeed = baseUnit.activationSpeed;
    this.activationSteps = baseUnit.activationSteps;
  }
}

// Used for css classnames, which are passed & switched on in onUnitAnimEnd below
export enum UnitAnimation {
  ACTIVATION_COOLDOWN = "activation-cooldown",
  ACTIVATION = "activation",
  ON_HIT = "on-hit",
  DEFEATED = "defeated",
}

// A Game Unit exists during a game
export class GameUnit {
  readonly id = createId();
  name: string;
  @observable health: number;
  @observable attack: number;
  @observable activationSpeed: number;
  @observable activationSpeedAnimating = false;
  @observable activationCooldown: number;
  @observable activationCooldownAnimating = false;
  @observable activationAnimating = false;
  @observable activationSteps: number;
  @observable defeatAnimating = false;
  @observable onHitAnimating = false;

  constructor(private builtUnit: BuiltUnit) {
    makeAutoObservable(this);

    // Props are initialised from the built unit values
    this.name = builtUnit.name;
    this.health = builtUnit.health;
    this.attack = builtUnit.attack;
    this.activationSpeed = builtUnit.activationSpeed;
    this.activationCooldown = this.activationSpeed;
    this.activationSteps = builtUnit.activationSteps;
  }

  get shouldActivate() {
    return this.activationCooldown <= 0 && this.activationSteps > 0;
  }

  getActivationTargets(opposingTeam: GameTeam): GameUnit[] {
    // Returns the units that this unit targets during its activation
    return [opposingTeam.getActiveUnit()];
  }

  @action activate(targets: GameUnit[]) {
    // Perform this unit's activation
    for (const targetUnit of targets) {
      // Basic attack
      targetUnit.health -= this.attack;
    }
  }

  @action onUnitAnimEnd = (anim: UnitAnimation) => {
    switch (anim) {
      case UnitAnimation.ACTIVATION_COOLDOWN:
        this.activationCooldownAnimating = false;
        break;
      case UnitAnimation.ACTIVATION:
        this.activationAnimating = false;
        break;
      case UnitAnimation.ON_HIT:
        this.onHitAnimating = false;
        break;
      case UnitAnimation.DEFEATED:
        this.defeatAnimating = false;
        break;
    }
  };
}
