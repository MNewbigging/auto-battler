import { action, makeAutoObservable, makeObservable, observable } from "mobx";

import { BuiltUnit, GameUnit, SlimGameUnit } from "./unit";
import { createId } from "../utils/utils";

export class Team {
  readonly id = createId();

  @observable units: BuiltUnit[];

  constructor(public name: string, units: BuiltUnit[]) {
    makeAutoObservable(this);

    this.units = units;
  }
}

export class GameTeam {
  readonly name: string;
  @observable units: GameUnit[];

  constructor(public team: Team, public rightSide = false) {
    makeAutoObservable(this);

    this.name = team.name;

    // Create the game units for this team
    this.units = team.units.map((builtUnit) => new GameUnit(builtUnit));

    // If this is a right-sided team, it should reverse its units
    if (this.rightSide) {
      this.units = this.units.reverse();
    }
  }

  get defeated() {
    return this.units.length === 0;
  }

  getActiveUnit() {
    return this.rightSide ? this.units[0] : this.units[this.units.length - 1];
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

export class SlimGameTeam {
  name: string;
  units: SlimGameUnit[];

  constructor(team: Team, public rightSide = false) {
    this.name = team.name;

    // Setup game units for this team
    const units = team.units.map((builtUnit) => new SlimGameUnit(builtUnit));

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
