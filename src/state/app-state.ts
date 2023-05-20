import { DropResult } from "@hello-pangea/dnd";
import { action, makeAutoObservable, observable } from "mobx";

import { BaseUnit, BuiltUnit } from "./unit";
import { GameState } from "./game-state";
import { GameTeam, Team } from "./team";
import { TeamBuilderState } from "./team-builder-state";
import { createRosterUnits, createTeams } from "../utils/unit-utils";

export enum AppPage {
  HOME = "home",
  PLAY = "play",
  ROSTER = "roster",
  TEAMS = "teams",
  TEAM_BUILDER = "team-builder",
  GAME = "game",
}

export class AppState {
  @observable currentPage = AppPage.HOME;

  // Roster
  rosterUnits: BaseUnit[] = [];

  // Teams
  @observable teams: Team[] = [];

  // Team builder
  teamBuilderState?: TeamBuilderState;

  // Play
  @observable leftTeam?: Team;
  @observable rightTeam?: Team;
  gameState?: GameState;

  constructor() {
    makeAutoObservable(this);

    this.rosterUnits = createRosterUnits();
    this.teams = createTeams();
  }

  @action setCurrentScreen(screen: AppPage) {
    this.currentPage = screen;
  }

  buildTeam = () => {
    this.teamBuilderState = new TeamBuilderState(this.rosterUnits);
    this.currentPage = AppPage.TEAM_BUILDER;
  };

  cancelBuildTeam = () => {
    this.teamBuilderState = undefined;
    this.currentPage = AppPage.TEAMS;
  };

  @action saveTeam = () => {
    if (!this.teamBuilderState) {
      return;
    }

    const team = this.teamBuilderState.getTeam();

    // Just for now
    team.name = `Team ${this.teams.length + 1}`;

    this.teams.push(team);

    this.teamBuilderState = undefined;

    this.setCurrentScreen(AppPage.TEAMS);
  };

  @action setLeftTeam = (team: Team) => {
    this.leftTeam = team;
  };

  @action setRightTeam = (team: Team) => {
    this.rightTeam = team;
  };

  play() {
    if (!this.leftTeam || !this.rightTeam) {
      return;
    }

    // Create game teams
    const left = new GameTeam(this.leftTeam);
    const right = new GameTeam(this.rightTeam, true);

    this.gameState = new GameState(left, right);

    this.setCurrentScreen(AppPage.GAME);
  }

  exitGame() {
    this.gameState = undefined;
    this.setCurrentScreen(AppPage.PLAY);
  }
}
