import { action, makeAutoObservable, observable } from "mobx";

export enum AppPage {
  HOME = "home",
  PLAY = "play",
  ROSTER = "roster",
  TEAM_BUILDER = "team-builder",
}

export class AppState {
  @observable currentPage = AppPage.HOME;

  constructor() {
    makeAutoObservable(this);
  }

  @action setCurrentScreen(screen: AppPage) {
    this.currentPage = screen;
  }
}
