import { action, makeAutoObservable, observable } from "mobx";

import { GameEvent, GameEventLog } from "./game-resolver";
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

    console.log("renderer got events: ", eventLog.events);

    this.leftTeam = leftTeam;
    this.rightTeam = rightTeam;

    // Start
    setTimeout(() => this.step(), 1000);
  }

  @action incrementTurn() {
    this.turn++;
  }

  @action step() {
    // Step through the event log
    const first = this.eventLog.events[0][0];

    // What is it?
    if (first.type === "game") {
      this[first.property] = first.value;
    }
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
