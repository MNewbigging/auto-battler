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
