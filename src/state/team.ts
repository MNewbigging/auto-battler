import { action, makeAutoObservable, makeObservable, observable } from "mobx";

import { BuiltUnit, GameUnit, SlimGameUnit } from "./unit";
import { createId } from "../utils/utils";

// A team made by a player
export class BuiltTeam {
  readonly id = createId();

  constructor(public name: string, public units: BuiltUnit[]) {}
}

// A team used by the game resolver
export class SlimGameTeam {
  name: string;
  units: SlimGameUnit[];

  constructor(public builtTeam: BuiltTeam, public rightSide = false) {
    this.name = builtTeam.name;

    // Setup game units for this team
    const units = builtTeam.units.map(
      (builtUnit) => new SlimGameUnit(builtUnit)
    );

    // Flip units on right side, as all teams are built for the left
    this.units = rightSide ? units.reverse() : units;
  }

  getActiveUnit() {
    return this.rightSide ? this.units[0] : this.units[this.units.length - 1];
  }

  getDefeatedUnits() {
    return this.units.filter((unit) => unit.defeated);
  }

  destroyDefeatedUnits() {
    this.units = this.units.filter((unit) => !unit.defeated);
  }
}

// A team used by the game renderer, requiring observable properties
export class GameTeam {
  readonly name: string;
  @observable units: GameUnit[];

  constructor(public team: BuiltTeam, public rightSide = false) {
    makeAutoObservable(this);

    this.name = team.name;

    // Create the game units for this team
    // Both teams are reversed
    this.units = team.units
      .map((builtUnit) => new GameUnit(builtUnit))
      .reverse();
  }

  get defeated() {
    return this.units.length === 0;
  }

  getActiveUnit() {
    return this.units[0];
  }

  hasDefeatedUnits() {
    return this.units.some((unit) => unit.defeated);
  }

  @action destroyUnit(unit: GameUnit) {
    const unitIndex = this.units.findIndex((u) => u.id === unit.id);
    if (unitIndex < 0) {
      return;
    }

    this.units.splice(unitIndex, 1);
  }
}
