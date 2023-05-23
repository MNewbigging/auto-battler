import { action, makeAutoObservable, observable } from "mobx";

import { GameEventLog } from "./game-resolver";
import { GameTeam } from "./team";

export class GameRendererState {
  leftTeam: GameTeam;
  rightTeam: GameTeam;

  @observable turn = 0;

  constructor(
    private eventLog: GameEventLog,
    leftTeam: GameTeam,
    rightTeam: GameTeam
  ) {
    makeAutoObservable(this);

    this.leftTeam = leftTeam;
    this.rightTeam = rightTeam;

    this.incrementTurn();
  }

  @action incrementTurn() {
    this.turn++;

    setTimeout(() => this.incrementTurn(), 2000);
  }

  private step() {
    // Step through the event log
  }
}

/**
 * This class will provide the state of a game for the renderer.
 * It does so by iterating over the event log of a game, triggering animations as appropriate.
 *
 * It needs to know:
 * - The teams involved; their names and units
 * - What values to change with each event (e.g turn counter) and by how much
 * - Which animations to run in parallel and when to wait for anim end before moving to next step
 *
 * Essentially, the events read like a series of commands to this class to perform various actions
 * that will end up affecting the observable state, so the renderer will respond.
 *
 *
 *
 */
