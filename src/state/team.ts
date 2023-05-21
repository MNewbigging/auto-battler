import { action, makeAutoObservable, makeObservable, observable } from "mobx";

import { BuiltUnit, GameUnit } from "./unit";
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

  getActiveUnit() {
    return this.rightSide ? this.units[0] : this.units[this.units.length - 1];
  }

  @action destroyUnit(unit: GameUnit) {
    const unitIndex = this.units.findIndex((u) => u.name === unit.name);
    if (unitIndex < 0) {
      return;
    }

    unit.defeatAnimating = true;

    // Remove when animating is finished
    setTimeout(() => this.units.splice(unitIndex, 1), 1600);
  }
}
