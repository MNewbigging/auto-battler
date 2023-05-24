import { action, computed, makeAutoObservable, observable } from "mobx";

import { BaseUnit } from "./unit";
import { BuiltTeam, GameTeam, SlimGameTeam } from "./team";
import { GameEventLog, GameResolver } from "./game-resolver";
import { GameRendererState } from "./game-renderer-state";
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
  @observable teams: BuiltTeam[] = [];

  // Team builder
  teamBuilderState?: TeamBuilderState;

  // Play
  @observable leftTeam?: BuiltTeam;
  @observable rightTeam?: BuiltTeam;
  gameRendererState?: GameRendererState;

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

  @action setLeftTeam = (team: BuiltTeam) => {
    this.leftTeam = team;
  };

  @action setRightTeam = (team: BuiltTeam) => {
    this.rightTeam = team;
  };

  @computed bothTeamsSet() {
    return this.leftTeam !== undefined && this.rightTeam !== undefined;
  }

  @action playTest() {
    if (!this.leftTeam || !this.rightTeam) {
      return;
    }

    // Create slim game teams
    const left = new SlimGameTeam(this.leftTeam, "left");
    const right = new SlimGameTeam(this.rightTeam, "right");

    // Create game runner and run the game
    const slimGameState = new GameResolver(left, right, this.onGameOver);
    slimGameState.startGame();
  }

  exitGame = () => {
    this.gameRendererState = undefined;
    this.setCurrentScreen(AppPage.PLAY);
  };

  @action onGameOver = (eventLog: GameEventLog) => {
    // Create game teams
    const left = new GameTeam(eventLog.leftTeam);
    const right = new GameTeam(eventLog.rightTeam, true);

    this.gameRendererState = new GameRendererState(eventLog, left, right);

    // Can now render the game
    this.currentPage = AppPage.GAME;
  };
}
