import { action, computed, makeAutoObservable, observable } from "mobx";

import { GameTeam, Team } from "./team";

/**
 * Unit types needed:
 *
 * - Base unit properties - what appears on the roster cards, the basic props of a unit
 * - Built unit properties - when team building, holds any changes as a result of mods
 * - Game unit properties - when in a game, tracks state of props (e.g health going down)
 *
 * - Base unit props never change - they are hardcoded
 * - Built unit props could change - user-defined and need to be stored
 * - Game unit props do change - transient, only changing during a game
 *
 *
 * Roster - base
 * Team build - built
 * Game - game
 * After game - built
 */

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
