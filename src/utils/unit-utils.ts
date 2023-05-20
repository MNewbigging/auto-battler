import { Team } from "../units/team";
import { Unit } from "../units/unit";

export function createUnits(): Unit[] {
  const bludger = new Unit({
    name: "Bludger boi",
    health: 3,
    attack: 3,
    activationSpeed: 3,
  });

  const stickler = new Unit({
    name: "Stickler",
    health: 1,
    attack: 1,
    activationSpeed: 1,
  });

  const bomber = new Unit({
    name: "Bomber",
    health: 2,
    attack: 5,
    activationSpeed: 5,
  });

  const shelly = new Unit({
    name: "Shelly",
    health: 6,
    attack: 1,
    activationSpeed: 3,
  });

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
