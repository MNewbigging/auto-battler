import { Team } from "../app-state";
import { Unit } from "../units/unit";

export function createUnits() {
  const bludger = new Unit();
  bludger.name = "Bludger boi";
  bludger.health = 3;
  bludger.attack = 3;
  bludger.activationSpeed = 3;

  const stickler = new Unit();
  stickler.name = "Stickler";
  stickler.health = 1;
  stickler.attack = 1;
  stickler.activationSpeed = 1;

  const bomber = new Unit();
  bomber.name = "Bomber";
  bomber.health = 2;
  bomber.attack = 5;
  bomber.activationSpeed = 5;

  const shelly = new Unit();
  shelly.name = "Shelly";
  shelly.health = 6;
  shelly.attack = 1;
  shelly.activationSpeed = 3;

  return [bludger, stickler, bomber, shelly];
}

export function createTeams() {
  const allUnits = createUnits();

  const team1Units = allUnits.slice(0, 4);
  const team1 = new Team("Team 1", team1Units);

  const team2Units = allUnits.slice(0, 4).reverse();
  const team2 = new Team("Team 2", team2Units);

  return [team1, team2];
}
