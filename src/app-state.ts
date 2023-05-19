import { DropResult } from "@hello-pangea/dnd";
import { action, makeAutoObservable, observable } from "mobx";

import { GameState } from "./game-state";
import { Unit } from "./units/unit";
import { createId } from "./utils/utils";
import { createTeams, createUnits } from "./utils/unit-utils";

export enum AppPage {
  HOME = "home",
  PLAY = "play",
  ROSTER = "roster",
  TEAMS = "teams",
  TEAM_BUILDER = "team-builder",
  GAME = "game",
}

export class Team {
  readonly id = createId();

  constructor(public name: string, public units: Unit[]) {}
}

export class AppState {
  @observable currentPage = AppPage.HOME;

  allUnits: Unit[] = [];
  @observable teamBuilderUnits: Unit[] = [];

  @observable teams: Team[] = [];
  @observable leftTeam?: Team;
  @observable rightTeam?: Team;

  gameState?: GameState;

  constructor() {
    makeAutoObservable(this);

    this.allUnits = createUnits();
    this.teams = createTeams();
  }

  @action setCurrentScreen(screen: AppPage) {
    this.currentPage = screen;
  }

  @action addUnitToTeam = (unit: Unit) => {
    this.teamBuilderUnits.push(unit);
  };

  @action removeUnitFromTeam = (index: number) => {
    this.teamBuilderUnits.splice(index, 1);
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
    const unit = this.teamBuilderUnits[source.index];

    // Remove from current position
    this.teamBuilderUnits.splice(source.index, 1);

    // Add to new position
    this.teamBuilderUnits.splice(destination.index, 0, unit);
  };

  @action saveTeam() {
    if (!this.teamBuilderUnits.length) {
      return;
    }

    this.teams.push(
      new Team(`Team ${this.teams.length + 1}`, this.teamBuilderUnits)
    );

    this.teamBuilderUnits = [];
  }

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

    this.gameState = new GameState(this.leftTeam, this.rightTeam);

    this.setCurrentScreen(AppPage.GAME);
  }
}
