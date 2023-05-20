import { DropResult } from "@hello-pangea/dnd";
import { action, makeAutoObservable, observable } from "mobx";

import { BaseUnit, BuiltUnit } from "./unit";
import { Team } from "./team";

export class TeamBuilderState {
  @observable teamName = "";
  @observable units: BuiltUnit[] = [];

  constructor(public rosterUnits: BaseUnit[]) {
    makeAutoObservable(this);
  }

  @action addUnitToTeam = (unit: BaseUnit) => {
    this.units.push(new BuiltUnit(unit));
  };

  @action removeUnitFromTeam = (index: number) => {
    this.units.splice(index, 1);
  };

  @action onTeamBuildDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      // Not on dropzone, do nothing
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      // Was dropped in same location, do nothing
      return;
    }

    // Find the unit to move
    const unit = this.units[source.index];

    // Remove from current position
    this.units.splice(source.index, 1);

    // Add to new position
    this.units.splice(destination.index, 0, unit);
  };

  getTeam() {
    return new Team(this.teamName, this.units);
  }
}
