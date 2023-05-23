import { action, makeAutoObservable, observable } from "mobx";

import { GameTeam, SlimGameTeam } from "./team";
import { createId } from "../utils/utils";

// Base units are used in the roster, these are their base property values
export interface BaseUnit {
  name: string;
  health: number;
  attack: number;
  activationSpeed: number;
  activationSteps: number;
}

// A Built Unit exists in a team, and may have been modified
export class BuiltUnit implements BaseUnit {
  name: string;
  @observable health: number;
  @observable attack: number;
  @observable activationSpeed: number;
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

// Used in the slim game resolver to determine game outcomes
export class SlimGameUnit implements BaseUnit {
  name: string;
  health: number;
  attack: number;
  activationSpeed: number;
  activationCooldown: number;
  activationSteps: number;
  activatedThisTurn = false;

  constructor(private builtUnit: BuiltUnit) {
    this.name = builtUnit.name;
    this.health = builtUnit.health;
    this.attack = builtUnit.attack;
    this.activationSpeed = builtUnit.activationSpeed;
    this.activationCooldown = builtUnit.activationSpeed;
    this.activationSteps = builtUnit.activationSteps;
  }

  get shouldActivate() {
    return this.activationCooldown <= 0 && this.activationSteps > 0;
  }

  get defeated() {
    return this.health <= 0;
  }

  getActivationTargets(friendlyTeam: SlimGameTeam, opposingTeam: SlimGameTeam) {
    // Just targeting enemy active unit for now
    return [opposingTeam.getActiveUnit()];
  }

  activate(targets: SlimGameUnit[]) {
    // Basic attack
    targets.forEach((target) => (target.health -= this.attack));

    // Used one activation step
    this.activationSteps--;

    this.activatedThisTurn = true;
  }

  postActivateReset() {
    this.activationSteps = this.builtUnit.activationSteps;
    this.activationCooldown = this.builtUnit.activationSpeed;
    this.activatedThisTurn = false;
  }
}

// Used by the game renderer, for animating a game playback
export class GameUnit {
  readonly id = createId();
  name: string;
  @observable health: number;
  @observable attack: number;
  @observable activationSpeed: number;
  @observable activationCooldown: number;
  @observable activationCooldownAnimating = false;
  @observable activationAnimating = false;
  @observable activationSteps: number;
  @observable defeatAnimating = false;
  @observable onHitAnimating = false;

  didActivate = false;

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

  get defeated() {
    return this.health <= 0;
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

  @action resetAfterActivation() {
    this.activationSteps = this.builtUnit.activationSteps;
    this.activationCooldown = this.builtUnit.activationSpeed;
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
