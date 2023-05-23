import { action, computed, makeAutoObservable, observable } from "mobx";

import { BaseUnit } from "./unit";
import { GameState } from "./game-state";
import { GameTeam, SlimGameTeam, Team } from "./team";
import { SlimGameState } from "./slim-game-state";
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

  getTeam(id: string) {
    return this.teams.find((team) => team.id === id);
  }

  @action buildTeam = () => {
    this.teamBuilderState = new TeamBuilderState(
      this.rosterUnits,
      `Team ${this.teams.length + 1}`
    );
    this.currentPage = AppPage.TEAM_BUILDER;
  };

  @action editTeam(id: string) {
    const team = this.getTeam(id);
    if (!team) {
      return;
    }

    const tbs = new TeamBuilderState(
      this.rosterUnits,
      `Team ${this.teams.length + 1}`
    );

    tbs.units = [...team.units];
    tbs.teamName = team.name;
    tbs.editingTeamId = id;

    this.teamBuilderState = tbs;
    this.currentPage = AppPage.TEAM_BUILDER;
  }

  @action cancelBuildTeam = () => {
    this.teamBuilderState = undefined;
    this.currentPage = AppPage.TEAMS;
  };

  @action saveTeam = () => {
    if (!this.teamBuilderState) {
      return;
    }

    const team = this.teamBuilderState.getTeam();

    // Was this an edit or a new team?
    if (this.teamBuilderState.editingTeamId) {
      // Find the team it replaces
      const editTeamId = this.teamBuilderState.editingTeamId;
      const editTeamIndex = this.teams.findIndex(
        (team) => team.id === editTeamId
      );
      if (editTeamIndex >= 0) {
        // Replace it with the new team
        this.teams.splice(editTeamIndex, 1, team);
      }
    } else {
      // Is a new team
      this.teams.push(team);
    }

    this.teamBuilderState = undefined;

    this.setCurrentScreen(AppPage.TEAMS);
  };

  @action deleteTeam(id: string) {
    this.teams = this.teams.filter((team) => team.id !== id);
  }

  @action setLeftTeam = (team: Team) => {
    this.leftTeam = team;
  };

  @action setRightTeam = (team: Team) => {
    this.rightTeam = team;
  };

  @computed bothTeamsSet() {
    return this.leftTeam !== undefined && this.rightTeam !== undefined;
  }

  playTest() {
    if (!this.leftTeam || !this.rightTeam) {
      return;
    }

    // Create slim game teams
    const left = new SlimGameTeam(this.leftTeam);
    const right = new SlimGameTeam(this.rightTeam);

    const slimGameState = new SlimGameState(left, right);

    slimGameState.startGame();
  }

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
