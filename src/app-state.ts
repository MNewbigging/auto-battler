import { action, makeAutoObservable, observable } from "mobx";

import { Unit } from "./units/unit";
import { createUnits } from "./utils/unit-utils";

export enum AppPage {
  HOME = "home",
  PLAY = "play",
  ROSTER = "roster",
  TEAM_BUILDER = "team-builder",
}

export class AppState {
  @observable currentPage = AppPage.HOME;

  allUnits: Unit[] = [];

  constructor() {
    makeAutoObservable(this);

    this.allUnits = createUnits();
  }

  @action setCurrentScreen(screen: AppPage) {
    this.currentPage = screen;
  }
}
