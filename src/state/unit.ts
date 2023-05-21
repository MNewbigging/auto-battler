import { AnimationEvent } from "react";
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  reaction,
} from "mobx";

import { GameTeam } from "./team";
import { createId } from "../utils/utils";

// Base units are used in the roster
export interface BaseUnit {
  name: string;
  health: number;
  attack: number;
  activationSpeed: number;
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

  constructor(public baseUnit: BaseUnit) {
    makeAutoObservable(this);

    // Props are initialised from the base unit values
    this.name = baseUnit.name;
    this.health = baseUnit.health;
    this.attack = baseUnit.attack;
    this.activationSpeed = baseUnit.activationSpeed;
  }
}

// A Game Unit exists during a game
export class GameUnit {
  readonly id = createId();
  name: string;
  @observable health: number;
  @observable healthAnimating = false;
  @observable attack: number;
  @observable attackAnimating = false;
  @observable activationSpeed: number;
  @observable activationSpeedAnimating = false;
  @observable activationCooldown: number;
  @observable activationCooldownAnimating = false;
  @observable activationAnimating = false;
  @observable defeatAnimating = false;

  constructor(private builtUnit: BuiltUnit) {
    makeAutoObservable(this);

    // Props are initialised from the built unit values
    this.name = builtUnit.name;
    this.health = builtUnit.health;
    this.attack = builtUnit.attack;
    this.activationSpeed = builtUnit.activationSpeed;
    this.activationCooldown = this.activationSpeed;
  }

  @computed isAnimating() {
    return (
      this.healthAnimating ||
      this.attackAnimating ||
      this.activationCooldownAnimating ||
      this.activationAnimating ||
      this.defeatAnimating
    );
  }

  get shouldActivate() {
    return this.activationCooldown <= 0;
  }

  @action reduceActivationCooldown = () => {
    this.activationCooldown--;
    this.activationCooldownAnimating = true;
  };

  @action onActivationCooldownAnimEnd = () => {
    this.activationCooldownAnimating = false;
  };

  @action activate(opponentTeam: GameTeam) {
    // Perform basic attack
    const activeTarget = opponentTeam.getActiveUnit();

    activeTarget.health -= this.attack;

    this.activationAnimating = true;
  }

  @action onUnitAnimEnd = (e: AnimationEvent<HTMLDivElement>) => {
    console.log(
      "activation ended for " + this.name + " anim: " + e.animationName
    );

    if (e.animationName === "active") {
      this.activationAnimating = false;
    }
  };

  @action onAcivationComplete() {
    // Reset values
    this.activationCooldown = this.activationSpeed;
  }
}
