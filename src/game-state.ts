import { Team } from "./app-state";

export class GameState {
  constructor(public leftTeam: Team, public rightTeam: Team) {}
}
