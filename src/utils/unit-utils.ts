import { BaseUnit } from "../state/unit";
import { Team } from "../state/team";
import { TeamBuilderState } from "../state/team-builder-state";

export function createRosterUnits(): BaseUnit[] {
  const bludger: BaseUnit = {
    name: "Bludger boi",
    health: 3,
    attack: 3,
    activationSpeed: 3,
  };

  const stickler: BaseUnit = {
    name: "Stickler",
    health: 1,
    attack: 1,
    activationSpeed: 1,
  };

  const bomber: BaseUnit = {
    name: "Bomber",
    health: 2,
    attack: 5,
    activationSpeed: 5,
  };

  const shelly: BaseUnit = {
    name: "Shelly",
    health: 6,
    attack: 1,
    activationSpeed: 3,
  };

  return [bludger, stickler, bomber, shelly];
}

export function createTeams() {
  const allUnits = createRosterUnits();

  let tbs = new TeamBuilderState();

  tbs.teamName = "Team 1";
  const team1Units = allUnits.slice(0, 4);
  team1Units.forEach((unit) => tbs.addUnitToTeam(unit));
  const team1 = tbs.getTeam();

  tbs = new TeamBuilderState();

  tbs.teamName = "Team 2";
  const team2Units = allUnits.slice(0, 4).reverse();
  team2Units.forEach((unit) => tbs.addUnitToTeam(unit));
  const team2 = tbs.getTeam();

  return [team1, team2];
}
