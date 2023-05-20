import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";

import { GameTeam, Team } from "./team";

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

    this.name = baseUnit.name;
    this.health = baseUnit.health;
    this.attack = baseUnit.attack;
    this.activationSpeed = baseUnit.activationSpeed;
  }
}

// A Game Unit exists during a game
export class GameUnit extends BuiltUnit {
  @observable activationCooldown: number;
  @observable activationCooldownAnimating = false;
  @observable activationAnimating = false;

  constructor(baseUnit: BaseUnit) {
    super(baseUnit);

    makeObservable(this, {
      activationCooldown: observable,
      activationCooldownAnimating: observable,
      activationAnimating: observable,
      isAnimating: computed,
      reduceActivationCooldown: action,
      activate: action,
    });

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
