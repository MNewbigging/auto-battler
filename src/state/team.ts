import { action, makeAutoObservable, observable } from "mobx";

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

  constructor(public team: Team) {
    makeAutoObservable(this);

    this.name = team.name;

    // Create the game units for this team
    this.units = team.units.map(
      (builtUnit) => new GameUnit(builtUnit.baseUnit)
    );
  }

  getActiveUnit() {
    return this.units[this.units.length - 1];
  }

  @action destroyUnit(unit: BuiltUnit) {
    const unitIndex = this.units.findIndex((u) => u.name === unit.name);
    if (unitIndex < 0) {
      return;
    }

    this.units.splice(unitIndex, 1);
  }
}
