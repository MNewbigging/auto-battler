import { action, makeAutoObservable, observable } from "mobx";

import { Unit } from "./units/unit";
import { createUnits } from "./utils/unit-utils";

export enum AppPage {
  HOME = "home",
  PLAY = "play",
  ROSTER = "roster",
  TEAMS = "teams",
  TEAM_BUILDER = "team-builder",
}

export class AppState {
  @observable currentPage = AppPage.HOME;

  allUnits: Unit[] = [];
  @observable teamBuilderUnits: Unit[] = [];

  constructor() {
    makeAutoObservable(this);

    this.allUnits = createUnits();
  }

  @action setCurrentScreen(screen: AppPage) {
    this.currentPage = screen;
  }

  @action setTeamBuilderUnits = (units: Unit[]) => {
    this.teamBuilderUnits = units;
    console.log("set units");
  };

  @action addUnitToTeam = (unit: Unit) => {
    this.teamBuilderUnits.push(unit);
  };
}
