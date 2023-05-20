import { action, makeAutoObservable, observable } from "mobx";

import { Unit } from "./unit";
import { createId } from "../utils/utils";

export class Team {
  readonly id = createId();

  @observable units: Unit[];

  constructor(public name: string, units: Unit[]) {
    makeAutoObservable(this);

    this.units = units;
  }

  getActiveUnit() {
    return this.units[this.units.length - 1];
  }

  @action destroyUnit(unit: Unit) {
    const unitIndex = this.units.findIndex((u) => u.name === unit.name);
    if (unitIndex < 0) {
      return;
    }

    this.units.splice(unitIndex, 1);
  }
}
