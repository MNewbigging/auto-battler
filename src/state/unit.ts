import { action, computed, makeAutoObservable, observable } from "mobx";

import { GameTeam } from "./team";

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
      this.healthAnimating &&
      this.activationAnimating &&
      this.activationCooldownAnimating
    );
  }

  @action reduceActivationCooldown() {
    this.activationCooldown--;

    this.activationCooldownAnimating = true;
  }

  @action activate(opponentTeam: GameTeam) {
    // Perform basic attack
    const activeTarget = opponentTeam.getActiveUnit();

    activeTarget.health -= this.attack;

    this.activationAnimating = true;
  }
}
