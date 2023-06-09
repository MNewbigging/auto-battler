import { BaseUnit } from "../state/unit";
import { TeamBuilderState } from "../state/team-builder-state";

export function createRosterUnits(): BaseUnit[] {
  const bludger: BaseUnit = {
    name: "Bludger boi",
    health: 3,
    attack: 3,
    activationSpeed: 3,
    activationSteps: 1,
  };

  const stickler: BaseUnit = {
    name: "Stickler",
    health: 1,
    attack: 1,
    activationSpeed: 2,
    activationSteps: 3,
  };

  const bomber: BaseUnit = {
    name: "Bomber",
    health: 2,
    attack: 5,
    activationSpeed: 5,
    activationSteps: 1,
  };

  const shelly: BaseUnit = {
    name: "Shelly",
    health: 6,
    attack: 1,
    activationSpeed: 3,
    activationSteps: 1,
  };

  const mite: BaseUnit = {
    name: "Mite",
    health: 1,
    attack: 1,
    activationSpeed: 5,
    activationSteps: 1,
  };

  return [bludger, stickler, bomber, shelly, mite];
}

export function createTeams() {
  const allUnits = createRosterUnits();

  let tbs = new TeamBuilderState(allUnits);

  tbs.teamName = "Team 1";
  const team1Units = allUnits.slice(0, 4);
  team1Units.forEach((unit) => tbs.addUnitToTeam(unit));
  const team1 = tbs.getTeam();

  tbs = new TeamBuilderState(allUnits);

  tbs.teamName = "Team 2";
  const team2Units = allUnits.slice(0, 4).reverse();
  team2Units.forEach((unit) => tbs.addUnitToTeam(unit));
  const team2 = tbs.getTeam();

  tbs = new TeamBuilderState(allUnits);

  tbs.teamName = "Stickler";
  tbs.addUnitToTeam(allUnits[1]);
  const team3 = tbs.getTeam();

  tbs = new TeamBuilderState(allUnits);

  tbs.teamName = "Shelly";
  tbs.addUnitToTeam(allUnits[3]);
  const shelly = tbs.getTeam();

  tbs = new TeamBuilderState(allUnits);

  tbs.teamName = "Mite";
  tbs.addUnitToTeam(allUnits[4]);
  tbs.addUnitToTeam(allUnits[4]);
  tbs.addUnitToTeam(allUnits[4]);
  tbs.addUnitToTeam(allUnits[4]);
  const team4 = tbs.getTeam();

  return [team1, team2, team3, team4, shelly];
}
