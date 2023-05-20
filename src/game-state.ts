import { Team } from "./app-state";

export class GameState {
  constructor(public leftTeam: Team, public rightTeam: Team) {
    this.setup();

    // Start after entry animations have finished
    setTimeout(() => this.startGame(), 2000);
  }

  setup() {
    // Create unit instances for the fight
  }

  startGame() {}
}
